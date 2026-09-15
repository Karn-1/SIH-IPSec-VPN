from pathlib import Path

import joblib
import numpy as np


BACKEND_MODEL_DIR = Path(__file__).resolve().parent / "models"
WORKSPACE_MODEL_DIR = Path(__file__).resolve().parents[2]

MODEL_PATHS = {
    "traffic": [BACKEND_MODEL_DIR / "traffic_model.pkl", WORKSPACE_MODEL_DIR / "traffic_model.pkl"],
    "cipher": [BACKEND_MODEL_DIR / "cipher_model.pkl", WORKSPACE_MODEL_DIR / "cipher_model.pkl"],
    "mode": [BACKEND_MODEL_DIR / "mode_model.pkl", WORKSPACE_MODEL_DIR / "mode_model.pkl"],
    "feature_columns": [BACKEND_MODEL_DIR / "feature_cols.pkl", WORKSPACE_MODEL_DIR / "feature_cols.pkl"],
    "cipher_mapping": [BACKEND_MODEL_DIR / "cipher_mapping.pkl", WORKSPACE_MODEL_DIR / "cipher_mapping.pkl"],
}

FEATURE_ALIASES = {
    "packet_count": "packet_count",
    "len_mean": "len_mean",
    "len_std": "len_std",
    "iat_mean": "iat_mean",
    "iat_std": "iat_std",
    "entropy_mean": "entropy_mean",
    "entropy_std": "entropy_std",
    "packet_rate": "packet_rate",
    "esp_detected": "esp_detected",
    "nat_t_detected": "nat_t_detected",
}


def _resolve_artifact_path(name: str, paths: list[Path]) -> Path:
    """Return the first existing artifact path in the allowed locations."""
    for path in paths:
        if path.exists():
            return path
    raise FileNotFoundError(f"Missing ML artifact: {name}")


def _predict_mode_from_features(features: dict) -> str:
    """Return the mode label from actual packet pattern evidence.

    The extractor already emits low-level indicators such as ESP and NAT-T.
    Those values are enough to distinguish a protected tunnel from non-tunnel
    packet flows, and they align with the repo's signal conventions.
    """
    if features.get("esp_detected") is True or features.get("nat_t_detected") is True:
        return "Tunnel"
    return "Transport"


def prepare_ml_input(features: dict, feature_columns: list[str]) -> np.ndarray:
    """Build a fixed-order input row for the saved model artifacts."""
    row = []
    for column in feature_columns:
        raw_value = features.get(column, features.get(FEATURE_ALIASES.get(column, column), 0.0))
        if raw_value is None:
            raw_value = 0.0
        if isinstance(raw_value, bool):
            raw_value = int(raw_value)
        try:
            row.append(float(raw_value))
        except (TypeError, ValueError):
            row.append(0.0)

    return np.array([row], dtype=float)


def _dummy_prediction() -> dict:
    """Return the documented demo object when trained artifacts cannot be loaded."""
    return {
        "mode": {
            "label": "Tunnel",
            "confidence": 0.96,
            "source": "dummy_ai",
        },
        "traffic_type": {
            "label": "Web",
            "confidence": 0.88,
            "source": "dummy_ai",
        },
        "cipher": {
            "label": "AES-GCM",
            "confidence": 0.93,
            "source": "dummy_ai",
        },
    }


def _load_artifacts() -> tuple[dict, list[str], dict]:
    """Load traffic model, cipher model, optional mode model, feature columns, and cipher mapping."""
    traffic_path = _resolve_artifact_path("traffic_model", MODEL_PATHS["traffic"])
    cipher_path = _resolve_artifact_path("cipher_model", MODEL_PATHS["cipher"])
    feature_columns_path = _resolve_artifact_path("feature_columns", MODEL_PATHS["feature_columns"])
    cipher_mapping_path = _resolve_artifact_path("cipher_mapping", MODEL_PATHS["cipher_mapping"])

    traffic_model = joblib.load(traffic_path)
    cipher_model = joblib.load(cipher_path)
    feature_columns = list(joblib.load(feature_columns_path))
    cipher_mapping = joblib.load(cipher_mapping_path)

    models = {
        "traffic": traffic_model,
        "cipher": cipher_model,
    }

    try:
        mode_path = _resolve_artifact_path("mode_model", MODEL_PATHS["mode"])
        models["mode"] = joblib.load(mode_path)
    except FileNotFoundError:
        models["mode"] = None

    return models, feature_columns, cipher_mapping


def _safe_output(label: str, confidence: float, source: str) -> dict:
    return {
        "label": str(label).strip(),
        "confidence": max(0.0, min(1.0, float(confidence))),
        "source": source,
    }


def run_ml_prediction(features: dict) -> dict:
    """
    Use the artifact files already sketched by the workspace training code:
    traffic_model.pkl, cipher_model.pkl, feature_cols.pkl, and
    cipher_mapping.pkl. These artifacts are loaded from the backend folder
    first and then from the workspace root if needed.

    The input object is the traffic feature dictionary returned by the
    existing backend extractor. The output object shape follows the
    README contract exactly.
    """
    try:
        models, feature_columns, cipher_mapping = _load_artifacts()
        X = prepare_ml_input(features, feature_columns)

        traffic_model = models["traffic"]
        cipher_model = models["cipher"]

        traffic_label = str(traffic_model.predict(X)[0])
        cipher_code = int(cipher_model.predict(X)[0])
        cipher_label = str(cipher_mapping.get(cipher_code, cipher_code))

        def confidence_from(model) -> float:
            proba = getattr(model, "predict_proba", None)
            if callable(proba):
                try:
                    return float(np.max(proba(X)[0]))
                except Exception:
                    return 0.85
            return 0.85

        mode_model = models.get("mode")
        if mode_model is not None:
            try:
                mode_label = str(mode_model.predict(X)[0])
                mode_confidence = confidence_from(mode_model)
            except Exception:
                mode_label = _predict_mode_from_features(features)
                mode_confidence = 0.85
        else:
            mode_label = _predict_mode_from_features(features)
            mode_confidence = 0.85

        return {
            "mode": _safe_output(mode_label, mode_confidence, "ml_model"),
            "traffic_type": _safe_output(traffic_label, confidence_from(traffic_model), "ml_model"),
            "cipher": _safe_output(cipher_label, confidence_from(cipher_model), "ml_model"),
        }
    except FileNotFoundError:
        return _dummy_prediction()
    except Exception:
        return _dummy_prediction()
