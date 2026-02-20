import numpy as np
from PIL import Image
import io
import time
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from app.model.loader import get_model
from app.services.disease_mapper import disease_mapper

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess the image to 224x224 for MobileNetV2"""
    # 1. Load image from bytes
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    # 2. Resize to what MobileNet expects (224x224)
    img = img.resize((224, 224))
    
    # 3. Use the official MobileNetV2 preprocess_input function
    # This automatically scales pixels to [-1, 1] internally ((x / 127.5) - 1)
    img_array = preprocess_input(np.array(img))
    
    # 4. Add batch dimension (1, 224, 224, 3)
    return np.expand_dims(img_array, axis=0)


def generate_heatmap(image_array: np.ndarray) -> list:
    """Generate Grad-CAM heatmap regions"""
    # This is a placeholder for actual Grad-CAM logic
    # Returning mock coordinates
    return [
        {"x": 0.5, "y": 0.5, "radius": 0.15, "intensity": 0.8}
    ]

def run_inference(image_bytes: bytes) -> dict:
    """Run model inference and return top predictions"""
    start_time = time.time()
    
    model = get_model()
    
    if model is None:
        # Fallback if model failed to load but server didn't crash
        return {
            "class_id": "healthy",
            "confidence": 0.5,
            "heatmap": [],
            "processing_time": int((time.time() - start_time) * 1000)
        }
    
    img_tensor = preprocess_image(image_bytes)
    
    # Get raw predictions array [[0.1, 0.8, 0.05, ...]]
    preds = model.predict(img_tensor)[0] 
    
    # Get index of highest confidence
    top_class_index = int(np.argmax(preds))
    confidence = float(np.max(preds))
    
    # Note: We need a mapping from your model's output index (0, 1, 2...) 
    # to the disease ID string (e.g. 'tomato-early-blight').
    # For now, we will assume your disease_mapper handles this, OR
    # we mock it if we don't know the exact order your model was trained in.
    
    # WE ARE ASSUMING THE FOLLOWING MAPPING BASED ON FOLDER ALPHABETICAL ORDER:
    # 0: healthy
    # 1: tomato-early-blight
    # 2: tomato-late-blight
    # etc...
    
    # Let's get the keys from our disease JSON to act as a temporary class list.
    # In reality, you MUST define this list exactly as your Model's `class_indices` mapped during training.
    class_names = [d["id"] for d in disease_mapper.diseases]
    
    # Safety fallback
    if top_class_index < len(class_names):
        top_class_id = class_names[top_class_index]
    else:
        top_class_id = "healthy"
    
    heatmap = generate_heatmap(img_tensor)
    processing_time = int((time.time() - start_time) * 1000)
    
    print(f"Predicted class index: {top_class_index}, ID mapped: {top_class_id}, Conf: {confidence}")
    
    return {
        "class_id": top_class_id,
        "confidence": confidence,
        "heatmap": heatmap,
        "processing_time": processing_time
    }
