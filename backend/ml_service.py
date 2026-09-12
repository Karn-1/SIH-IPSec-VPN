import numpy as np


def prepare_ml_input(features: dict, feature_columns: list[str]) -> np.ndarray:
    """Arrange extracted features in the exact model training order."""
    return np.array([[features.get(column, 0.0) for column in feature_columns]])


def _dummy_prediction() -> dict:
    """Return the temporary prediction used until trained models are available."""
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


def run_ml_prediction(features: dict) -> dict:
    """
    Run model inference and return the API prediction contract.

    The dummy response is intentionally active for now. When the trained
    artifacts are available, replace the final return with the commented
    inference block below. The FastAPI response contract will not change.
    """

    # ============================================================
    # FUTURE ML INTEGRATION
    # ============================================================
    #
    # import joblib
    #
    # mode_model = joblib.load("models/mode_model.pkl")
    # traffic_model = joblib.load("models/traffic_model.pkl")
    # cipher_model = joblib.load("models/cipher_model.pkl")
    # feature_columns = joblib.load("models/feature_cols.pkl")
    #
    # X = prepare_ml_input(features, feature_columns)
    #
    # mode_label = mode_model.predict(X)[0]
    # traffic_label = traffic_model.predict(X)[0]
    # cipher_label = cipher_model.predict(X)[0]
    #
    # mode_confidence = float(np.max(mode_model.predict_proba(X)[0]))
    # traffic_confidence = float(
    #     np.max(traffic_model.predict_proba(X)[0])
    # )
    # cipher_confidence = float(
    #     np.max(cipher_model.predict_proba(X)[0])
    # )
    #
    # return {
    #     "mode": {
    #         "label": str(mode_label),
    #         "confidence": mode_confidence,
    #     },
    #     "traffic_type": {
    #         "label": str(traffic_label),
    #         "confidence": traffic_confidence,
    #     },
    #     "cipher": {
    #         "label": str(cipher_label),
    #         "confidence": cipher_confidence,
    #     },
    # }

    # ============================================================
    # ACTIVE TEMPORARY RESPONSE
    # ============================================================
    return _dummy_prediction()
