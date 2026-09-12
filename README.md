# IPsec AI Security Analyzer

An AI-powered IPsec VPN protocol analyzer and security assessment framework.
The project combines a React/Vite frontend with a Python/FastAPI backend that
parses PCAP traffic, extracts measurable features, optionally parses a
StrongSwan SA log, calculates a security score, and renders a complete report.

## Current status

- PCAP/PCAPNG/CAP upload from the frontend
- Optional StrongSwan SA-log upload
- Temporary upload handling with cleanup after analysis
- Scapy-based IPv4/IPv6, ESP, NAT-T, packet length, timing, and entropy extraction
- Robust SA-log parsing for cipher, key size, DH group, PFS, replay protection,
  SHA-1, lifetime, and tunnel/transport mode
- Null-safe risk scoring and findings/recommendations
- Complete JSON response rendered by the frontend
- Local browser history for completed analyses
- High-contrast green cybersecurity dashboard UI

## Architecture

```text
User
  |
  v
React/Vite frontend
  |
  | multipart/form-data: PCAP + optional SA log
  v
POST /api/analyze
  |
  +--> temporary PCAP file --> Scapy feature extraction
  |                              |
  |                              +--> packet metrics and entropy
  |
  +--> temporary SA log -------> StrongSwan parser
                                 |
                                 +--> security configuration
  |
  +--> AI prediction service
  |
  +--> risk engine
  |
  v
Complete JSON response
  |
  v
Dashboard, charts, findings, recommendations, and report
```

## Repository structure

```text
SIH/
├── backend/
│   ├── main.py
│   ├── extract_features.py
│   ├── parse_ipsec.py
│   ├── ml_service.py
│   ├── risk_engine.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Clone the project

```bash
git clone https://github.com/Karn-1/SIH-IPSec-VPN.git
cd SIH-IPSec-VPN
```

## Backend setup

Create and activate a virtual environment:

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
cd backend
pip install -r requirements.txt
```

Start the API:

```powershell
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

## Frontend setup

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

The frontend uses `http://localhost:8000` as the default API URL. To override
it, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## Analysis flow

1. Select a required `.pcap`, `.pcapng`, or `.cap` capture.
2. Optionally select a StrongSwan SA log.
3. The frontend sends one multipart request to `POST /api/analyze`.
4. The backend temporarily stores the uploads.
5. Scapy extracts packet and traffic features.
6. The SA parser extracts configuration values when an SA log is present.
7. The AI service returns predictions.
8. The risk engine calculates the score, status, findings, and recommendations.
9. The backend returns one complete JSON object.
10. The frontend renders the result and stores it in browser history.

## Current AI behavior and future ML integration

The current backend intentionally returns a **dummy AI response** so the
application can be demonstrated before trained model files are supplied.
This behavior is implemented in `backend/ml_service.py`.

The dummy response currently returns:

```json
{
  "mode": {
    "label": "Tunnel",
    "confidence": 0.96,
    "source": "dummy_ai"
  },
  "traffic_type": {
    "label": "Web",
    "confidence": 0.88,
    "source": "dummy_ai"
  },
  "cipher": {
    "label": "AES-GCM",
    "confidence": 0.93,
    "source": "dummy_ai"
  }
}
```

The real ML integration is already **commented in
`backend/ml_service.py`**. It is not active until trained artifacts are
available. The commented implementation shows how to:

1. Load the mode, traffic, and cipher models with `joblib`.
2. Load the feature-column order.
3. Build the model input from extracted PCAP features.
4. Call `predict()`.
5. Call `predict_proba()` for confidence.
6. Return the same frontend-compatible response contract.

When models are ready, place the artifacts under `backend/models/`:

```text
backend/models/
├── mode_model.pkl
├── traffic_model.pkl
├── cipher_model.pkl
└── feature_cols.pkl
```

Before enabling real inference, confirm that the feature names and ordering
match the columns used during model training. The model input must be built
from the same features, such as:

```text
len_mean
len_std
iat_mean
iat_std
entropy_mean
packet_rate
esp_detected
nat_t_detected
```

The ML response shape should remain unchanged. Replace the dummy return with
the commented model-inference return and change the prediction source from
`dummy_ai` to `ml_model`.

## SA-log behavior

SA configuration is parsed from the uploaded log, not predicted by ML.
Example parsed configuration:

```json
{
  "available": true,
  "source": "strongswan_sa_log",
  "pfs_enabled": true,
  "replay_protection": true,
  "dh_group": "MODP-3072",
  "key_size_bits": 256,
  "sha1_used": false,
  "key_lifetime": 28800,
  "cipher": "aes-gcm",
  "mode": "Tunnel"
}
```

When no SA log is supplied, the backend keeps configuration unknown instead
of inventing disabled values:

```json
{
  "available": false,
  "source": null,
  "pfs_enabled": null,
  "replay_protection": null,
  "dh_group": null,
  "key_size_bits": null,
  "sha1_used": null,
  "key_lifetime": null,
  "cipher": null,
  "mode": null
}
```

The response includes a `SA_LOG_NOT_PROVIDED` notice in that case.

## API response contract

`POST /api/analyze` returns:

```json
{
  "analysis": {
    "id": "ANL-001",
    "filename": "office_vpn_01.pcap",
    "status": "completed",
    "created_at": "2026-09-12T13:20:00Z"
  },
  "ai_predictions": {
    "mode": {
      "label": "Tunnel",
      "confidence": 0.96,
      "source": "dummy_ai"
    },
    "traffic_type": {
      "label": "Web",
      "confidence": 0.88,
      "source": "dummy_ai"
    },
    "cipher": {
      "label": "AES-GCM",
      "confidence": 0.93,
      "source": "dummy_ai"
    }
  },
  "traffic_features": {
    "packet_count": 8421,
    "len_mean": 731.2,
    "len_std": 112.4,
    "iat_mean": 0.038,
    "iat_std": 0.012,
    "entropy_mean": 7.04
  },
  "security_configuration": {},
  "security_assessment": {
    "score": 95,
    "status": "Secure",
    "findings": [],
    "recommendations": []
  },
  "notices": []
}
```

The frontend consumes the response through:

```text
analysis.analysis
analysis.ai_predictions
analysis.traffic_features
analysis.security_configuration
analysis.security_assessment
analysis.notices
```

## Validation

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Backend syntax:

```powershell
cd backend
python -m compileall -q .
```

## Security and repository hygiene

Do not commit:

- `frontend/.env`
- `.venv/`
- `frontend/node_modules/`
- `frontend/dist/`
- `__pycache__/`
- PCAP captures or private SA logs
- Trained model artifacts unless intentionally approved

