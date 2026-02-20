"""
Example Backend for PlantCare AI
=================================

This is a minimal example showing how to create a backend API
for the PlantCare AI frontend.

Prerequisites:
--------------
pip install flask flask-cors pillow tensorflow numpy

Usage:
------
python EXAMPLE_BACKEND.py

Then update the frontend:
- Set API_ENDPOINT = 'http://localhost:5000/predict'
- Set USE_MOCK_DATA = false
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64
import numpy as np

# Optional: If using TensorFlow/Keras
# from tensorflow.keras.models import load_model

app = Flask(__name__)

# Enable CORS for all routes
# In production, specify your frontend domain:
# CORS(app, origins=["https://your-frontend.com"])
CORS(app)

# ============================================
# CONFIGURATION
# ============================================

# Load your trained model
# MODEL = load_model('path/to/your/model.h5')

# Your model's class names (in the same order as training)
CLASSES = [
    'Tomato Early Blight',
    'Tomato Late Blight',
    'Potato Early Blight',
    'Potato Late Blight',
    'Corn Common Rust',
    'Wheat Leaf Rust',
    'Grape Black Rot',
    'Apple Scab',
    'Healthy Plant'
]

# Image preprocessing settings
IMG_SIZE = (224, 224)  # Match your model's input size

# ============================================
# HELPER FUNCTIONS
# ============================================

def decode_image(image_data):
    """
    Decode base64 image data to PIL Image
    
    Args:
        image_data: Base64 encoded image string
        
    Returns:
        PIL Image object
    """
    # Remove data URL prefix if present
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    
    # Decode base64
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    return image

def preprocess_image(image):
    """
    Preprocess image for model input
    
    Args:
        image: PIL Image
        
    Returns:
        Preprocessed numpy array ready for model
    """
    # Resize to model input size
    image = image.resize(IMG_SIZE)
    
    # Convert to numpy array
    image_array = np.array(image)
    
    # Normalize pixel values (0-255 to 0-1)
    image_array = image_array / 255.0
    
    # Add batch dimension (model expects batch of images)
    image_array = np.expand_dims(image_array, axis=0)
    
    return image_array

def predict_disease(image_array):
    """
    Run model inference
    
    Args:
        image_array: Preprocessed image array
        
    Returns:
        dict with class name and confidence
    """
    # TODO: Replace this with your actual model inference
    # predictions = MODEL.predict(image_array)
    
    # MOCK PREDICTION (remove when using real model)
    # Simulate model output
    predictions = np.array([[0.05, 0.10, 0.15, 0.05, 0.05, 0.05, 0.45, 0.05, 0.05]])
    
    # Get the class with highest probability
    class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][class_idx])
    
    return {
        'class': CLASSES[class_idx],
        'confidence': confidence
    }

def get_recommendations(disease_name):
    """
    Get care recommendations for a disease
    
    Args:
        disease_name: Name of the detected disease
        
    Returns:
        List of recommendation strings
    """
    # You can maintain a database of recommendations
    recommendations_db = {
        'Tomato Early Blight': [
            'Remove infected leaves immediately',
            'Apply copper-based fungicide spray',
            'Increase airflow around plants',
            'Water at soil level, avoid wetting leaves'
        ],
        'Healthy Plant': [
            'Continue regular watering schedule',
            'Maintain proper fertilization',
            'Monitor for early signs of stress'
        ],
        # Add more diseases and recommendations
    }
    
    return recommendations_db.get(
        disease_name,
        ['Monitor plant closely', 'Consult a local agricultural expert']
    )

# ============================================
# API ROUTES
# ============================================

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'service': 'PlantCare AI Backend',
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    
    Expected input:
        - Form data with 'image' field containing base64 image
        
    Returns:
        JSON with class, confidence, and recommendations
    """
    try:
        # Get image data from request
        image_data = request.form.get('image')
        
        if not image_data:
            return jsonify({
                'error': 'No image provided',
                'message': 'Please send image data in the request'
            }), 400
        
        # Decode and preprocess image
        image = decode_image(image_data)
        image_array = preprocess_image(image)
        
        # Run prediction
        result = predict_disease(image_array)
        
        # Get recommendations
        recommendations = get_recommendations(result['class'])
        
        # Return result
        return jsonify({
            'class': result['class'],
            'confidence': result['confidence'],
            'recommendations': recommendations
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check for monitoring"""
    return jsonify({'status': 'healthy'}), 200

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({
        'error': 'File too large',
        'message': 'Image must be less than 10MB'
    }), 413

@app.errorhandler(500)
def server_error(e):
    """Handle server errors"""
    return jsonify({
        'error': 'Server error',
        'message': 'Something went wrong. Please try again.'
    }), 500

# ============================================
# RUN SERVER
# ============================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("PlantCare AI Backend Server")
    print("="*50)
    print("\nServer starting on http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  GET  /          - Health check")
    print("  POST /predict   - Plant disease prediction")
    print("  GET  /health    - System health")
    print("\nTo integrate with frontend:")
    print("  1. Keep this server running")
    print("  2. Update /src/app/services/plantAI.ts:")
    print("     - API_ENDPOINT = 'http://localhost:5000/predict'")
    print("     - USE_MOCK_DATA = false")
    print("  3. Test with a plant image!")
    print("\n" + "="*50 + "\n")
    
    # Run server
    # For production, use gunicorn or similar
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True  # Set to False in production
    )

"""
DEPLOYMENT NOTES
================

For production deployment:

1. Use a production WSGI server:
   gunicorn -w 4 -b 0.0.0.0:5000 EXAMPLE_BACKEND:app

2. Configure CORS properly:
   CORS(app, origins=["https://your-frontend-domain.com"])

3. Add authentication:
   - API keys
   - JWT tokens
   - OAuth

4. Add rate limiting:
   from flask_limiter import Limiter
   limiter = Limiter(app, default_limits=["100 per hour"])

5. Add monitoring:
   - Error tracking (Sentry)
   - Performance monitoring
   - Logging

6. Optimize model loading:
   - Load model once at startup
   - Use model caching
   - Consider batch processing

7. Add validation:
   - File size limits
   - Image format validation
   - Request validation

8. Use environment variables:
   import os
   MODEL_PATH = os.getenv('MODEL_PATH', 'default/path')
"""
