from pathlib import Path

from fastapi.testclient import TestClient

from main import app


def test_analyze_accepts_pcap_and_sa_log_without_file_alias():
    client = TestClient(app)
    pcap_path = Path("test_data/sample_natt_strong.pcap")
    sa_log_path = Path("test_data/sample_strong_sa.log")

    response = client.post(
        "/api/analyze",
        files={
            "pcap": (pcap_path.name, pcap_path.open("rb"), "application/octet-stream"),
            "sa_log": (sa_log_path.name, sa_log_path.open("rb"), "text/plain"),
        },
    )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert "analysis" in payload
    assert "ai_predictions" in payload
    assert "traffic_features" in payload
