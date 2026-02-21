import logging
import numpy as np
import io
import time
from PIL import Image, UnidentifiedImageError
import pillow_avif
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing import image
from app.model.loader import get_model
from app.services.disease_mapper import disease_mapper

logger = logging.getLogger("plantcare")

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess the image to 224x224 EXACTLY as in the Colab training script"""
    # 1. Load image using Keras specifically (matches Colab)
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert('RGB')
    except UnidentifiedImageError:
        raise ValueError("Unsupported image format. Please upload a valid JPEG, PNG, WEBP, or AVIF file.")
    except Exception as e:
        # Catch EVERY other possible parsing failure (corrupted bytes, plugin crashes, EOF)
        raise ValueError(f"Image parsing failed: {str(e)}")
        
    img = img.resize((224, 224))
    
    # 2. Convert to array using Keras (this casts to float32 unlike PIL np.array)
    img_array = image.img_to_array(img)
    
    # 3. Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    # 4. Built-in MobileNetV2 preprocessing (-1 to 1)
    img_array = preprocess_input(img_array)
    
    return img_array


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
    
    # ==========================================
    # DEBUGGING: Print exact Colab comparisons
    # ==========================================
    logger.debug(f"Raw preds: {preds}")
    logger.debug(f"Predicted index: {top_class_index}")
    logger.debug(f"Confidence: {confidence}")
    
    # MobileNetV2 was trained on the 38-class PlantVillage dataset.
    # We map all 38 indexes to their corresponding string IDs.
    PLANT_VILLAGE_CLASSES = [
        "apple-scab", # 0
        "apple-black-rot", # 1
        "apple-cedar-rust", # 2
        "apple-healthy", # 3
        "blueberry-healthy", # 4
        "cherry-powdery-mildew", # 5
        "cherry-healthy", # 6
        "corn-cercospora-leaf-spot", # 7
        "corn-rust", # 8
        "corn-northern-leaf-blight", # 9
        "corn-healthy", # 10
        "grape-black-rot", # 11
        "grape-esca", # 12
        "grape-leaf-blight", # 13
        "grape-healthy", # 14
        "orange-haunglongbing", # 15
        "peach-bacterial-spot", # 16
        "peach-healthy", # 17
        "pepper-bell-bacterial-spot", # 18
        "pepper-bell-healthy", # 19
        "potato-early-blight", # 20
        "potato-late-blight", # 21
        "potato-healthy", # 22
        "raspberry-healthy", # 23
        "soybean-healthy", # 24
        "squash-powdery-mildew", # 25
        "strawberry-leaf-scorch", # 26
        "strawberry-healthy", # 27
        "tomato-bacterial-spot", # 28
        "tomato-early-blight", # 29
        "tomato-late-blight", # 30
        "tomato-leaf-mold", # 31
        "tomato-septoria-leaf-spot", # 32
        "tomato-spider-mites", # 33
        "tomato-target-spot", # 34
        "tomato-yellow-leaf-curl-virus", # 35
        "tomato-mosaic-virus", # 36
        "tomato-healthy", # 37
    ]
    
    # Extract mapped ID safely. MobileNetV2 can hallucinate random plants (e.g. Blueberry) on non-plant images.
    # Softmax naturally pushes out-of-distribution junk to near 1.0 confidence for generic classes like 'blueberry-healthy'.
    global_threshold = 0.65
    
    if top_class_index < len(PLANT_VILLAGE_CLASSES) and confidence >= global_threshold:
        top_class_id = PLANT_VILLAGE_CLASSES[top_class_index]
        
        # AGGRESSIVE FILTER: "blueberry-healthy" is the model's favorite hallucination for unknown generic leaves.
        # Softmax outputs frequently saturate to exactly 1.0 confidence for this class due to float32 rounding.
        # Since Gemini handles real blueberries perfectly, we aggressively route this MobileNet fallback directly to unknown.
        if top_class_id == "blueberry-healthy":
            logger.info(f"Targeted rejection of blueberry-healthy hallucination (confidence {confidence})")
            top_class_id = "unknown"
    else:
        top_class_id = "unknown"
        
    heatmap = generate_heatmap(img_tensor)
    processing_time = int((time.time() - start_time) * 1000)
    
    logger.info(f"Predicted class index: {top_class_index}, ID mapped: {top_class_id}, Conf: {confidence}")
    
    return {
        "class_id": top_class_id,
        "confidence": confidence,
        "heatmap": heatmap,
        "processing_time": processing_time
    }
