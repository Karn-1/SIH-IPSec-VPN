import os
import shutil
import tempfile
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from scapy.error import Scapy_Exception

from extract_features import extract_features
from ml_service import run_ml_prediction
from parse_ipsec import parse_sa_log, unavailable_security_configuration
from risk_engine import assess_security

app = FastAPI(title="IPsec AI Security API", version="1.0.0")
MAX_UPLOAD_SIZE = 100 * 1024 * 1024
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "IPsec AI Security API"}


@app.post("/api/analyze")
async def analyze_pcap(
    pcap: UploadFile | None = File(None),
    sa_log: UploadFile | None = File(None),
) -> dict:
    capture = pcap
    if capture is None or not capture.filename:
        raise HTTPException(status_code=400, detail="No PCAP file provided.")
    if not capture.filename.lower().endswith((".pcap", ".pcapng", ".cap")):
        raise HTTPException(
            status_code=400,
            detail="Only .pcap, .pcapng, and .cap capture files are supported.",
        )

    temp_dir = tempfile.mkdtemp(prefix="ipsec-ai-")
    pcap_path = os.path.join(temp_dir, f"{uuid.uuid4().hex}.pcap")
    sa_path = None
    try:
        with open(pcap_path, "wb") as destination:
            total_size = 0
            while chunk := capture.file.read(1024 * 1024):
                total_size += len(chunk)
                if total_size > MAX_UPLOAD_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="PCAP file exceeds the 100 MB upload limit.",
                    )
                destination.write(chunk)
        if sa_log and sa_log.filename:
            sa_path = os.path.join(temp_dir, f"{uuid.uuid4().hex}.log")
            with open(sa_path, "wb") as destination:
                total_size = 0
                while chunk := sa_log.file.read(1024 * 1024):
                    total_size += len(chunk)
                    if total_size > MAX_UPLOAD_SIZE:
                        raise HTTPException(
                            status_code=413,
                            detail="SA log exceeds the 100 MB upload limit.",
                        )
                    destination.write(chunk)

        raw_features = extract_features(pcap_path)
        response_features = {key: value for key, value in raw_features.items() if not key.startswith("_")}
        configuration = parse_sa_log(sa_path) if sa_path else unavailable_security_configuration()
        predictions = run_ml_prediction(response_features)
        assessment = assess_security(configuration, response_features)
        notices = [] if configuration["available"] else [{"type": "warning", "code": "SA_LOG_NOT_PROVIDED", "message": "StrongSwan SA log was not provided. Security configuration fields requiring SA information could not be determined."}]
        return {
            "analysis": {"id": f"ANL-{uuid.uuid4().hex[:8].upper()}", "filename": capture.filename, "status": "completed", "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")},
            "ai_predictions": predictions,
            "traffic_features": response_features,
            "security_configuration": configuration,
            "security_assessment": assessment,
            "notices": notices,
        }
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Scapy_Exception as error:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid PCAP or PCAPNG capture.",
        ) from error
    except (OSError, RuntimeError) as error:
        raise HTTPException(status_code=400, detail="Unable to parse the provided capture or SA log.") from error
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
