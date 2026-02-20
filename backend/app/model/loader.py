import tensorflow as tf
from app.config import settings
import os

_model = None

def get_model():
    """Returns the loaded model, loading it if necessary."""
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), settings.model_path)
        try:
            print(f"Loading model from {model_path}...")
            _model = tf.keras.models.load_model(model_path)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            _model = None
    return _model
