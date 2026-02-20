# 🌿 PlantCare AI - Model Integration Guide

This guide will help you integrate your trained plant disease detection model into the PlantCare AI frontend.

## 📋 Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Integration Steps](#integration-steps)
4. [API Configuration](#api-configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The frontend is **fully ready** for your model integration. All you need to do is:
1. Deploy your model as an API endpoint
2. Update the configuration in `/src/app/services/plantAI.ts`
3. Toggle `USE_MOCK_DATA` to `false`

The app currently uses mock data for demonstration, but the data flow is production-ready.

---

## Quick Start

### Current Flow (MVP with Mock Data)
```
User uploads image → Image stored in sessionStorage → 
Analyzing screen (mock AI call) → Result screen (mock data)
```

### Future Flow (With Your Model)
```
User uploads image → Image sent to your API endpoint → 
Your model processes → Response mapped to UI → 
Result screen displays real diagnosis
```

---

## Integration Steps

### Step 1: Deploy Your Model

Deploy your trained model with an API endpoint that accepts images and returns predictions.

**Recommended Deployment Options:**
- **Flask/FastAPI** (Python) - Simple and effective
- **TensorFlow Serving** - For TensorFlow models
- **AWS Lambda + API Gateway** - Serverless option
- **Google Cloud Run** - Container-based deployment
- **Azure ML** - Enterprise option

**Example API Response Format:**
```json
{
  "class": "Tomato Early Blight",
  "confidence": 0.95,
  "recommendations": [
    "Remove infected leaves immediately",
    "Apply copper-based fungicide spray"
  ]
}
```

### Step 2: Update Configuration

Open `/src/app/services/plantAI.ts` and update:

```typescript
// Line 21-23: Update these constants
const API_ENDPOINT = 'https://your-api-endpoint.com/predict'; // Your API URL
const USE_MOCK_DATA = false; // Toggle to use real model
const ANALYSIS_DELAY = 2500; // Optional: adjust for UX
```

### Step 3: Customize Request Format (if needed)

If your model expects a different input format, modify the `realAnalyzeImage` function:

```typescript
// Example: If your model needs specific parameters
const formData = new FormData();
formData.append('image', request.image);
formData.append('model_version', 'v1');
formData.append('confidence_threshold', '0.7');
```

### Step 4: Map Model Output

If your model returns different class names, update the disease mapping in `/src/app/utils/diseases.ts`:

```typescript
export const diseases: Disease[] = [
  {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight', // Match this to your model output
    recommendations: [...],
    severity: 'medium'
  },
  // Add more diseases that your model can detect
];
```

### Step 5: Test & Deploy

1. Test with mock data first
2. Test with your API in development
3. Deploy frontend (Netlify, Vercel, etc.)
4. Update API_ENDPOINT to production URL

---

## API Configuration

### Option 1: Base64 Image Upload
```typescript
// Your API receives base64 encoded image
formData.append('image', request.image);
```

### Option 2: File Upload
```typescript
// Your API receives actual file
if (request.imageFile) {
  formData.append('file', request.imageFile);
}
```

### Option 3: Image URL
```typescript
// Upload to storage first, then send URL
const imageUrl = await uploadToStorage(request.image);
formData.append('image_url', imageUrl);
```

### Adding Authentication

If your API requires authentication:

```typescript
const response = await fetch(API_ENDPOINT, {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${YOUR_API_KEY}`,
    // Don't set Content-Type for FormData - browser sets it automatically
  }
});
```

---

## Model Requirements

### Expected Input
- **Format**: JPEG, PNG
- **Size**: Any (frontend will handle)
- **Preprocessing**: Optional (can be done client-side or server-side)

### Expected Output
Your model API should return:

```typescript
{
  class: string,           // Disease name (e.g., "Tomato Early Blight")
  confidence: number,      // Confidence score 0-1 (e.g., 0.95)
  recommendations?: string[] // Optional, can be added on backend
}
```

### Adding Preprocessing

If your model needs specific preprocessing (resize, normalize, etc.), add it to `preprocessImage()`:

```typescript
export async function preprocessImage(imageData: string): Promise<string> {
  // Example: Resize to 224x224
  const img = new Image();
  img.src = imageData;
  
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 224, 224);
  
  return canvas.toDataURL('image/jpeg', 0.9);
}
```

---

## Testing

### Test with Mock Data
```typescript
// In plantAI.ts
const USE_MOCK_DATA = true; // Keep this for initial testing
```

### Test with Your API
```typescript
// In plantAI.ts
const USE_MOCK_DATA = false;
const API_ENDPOINT = 'http://localhost:5000/predict'; // Local testing
```

### Example Test Cases
1. Upload a clear plant leaf image → Should return diagnosis
2. Upload a blurry image → Should still work or show validation error
3. Upload a non-plant image → Model should handle gracefully
4. Test network failure → Should show error message

---

## Troubleshooting

### CORS Issues
If you get CORS errors:

**Backend Solution (Flask example):**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://your-frontend-domain.com"])
```

### Image Too Large
Add size validation:
```typescript
// In plantAI.ts, validateImage function
const maxSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxSize) {
  return { valid: false, error: 'Image too large' };
}
```

### Slow Response Times
Add loading states and consider:
1. Image compression before upload
2. Using WebP format
3. Server-side caching
4. CDN for API endpoint

### Model Confidence Too Low
Handle low confidence in the UI:
```typescript
if (result.confidence < 0.5) {
  // Show "Uncertain diagnosis" message
  // Suggest retaking photo
}
```

---

## File Structure

```
src/app/
├── services/
│   └── plantAI.ts          ← Main integration file
├── utils/
│   └── diseases.ts         ← Disease database
├── screens/
│   ├── Home.tsx            ← Image upload
│   ├── Analyzing.tsx       ← Calls your model
│   └── Result.tsx          ← Displays diagnosis
└── ...
```

---

## Example Backend (Flask + TensorFlow)

Here's a simple example of what your backend might look like:

```python
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
model = load_model('plant_disease_model.h5')

CLASSES = [
    'Tomato Early Blight',
    'Tomato Late Blight',
    'Potato Early Blight',
    'Healthy Plant',
    # ... your classes
]

@app.route('/predict', methods=['POST'])
def predict():
    # Get image from request
    image_data = request.form.get('image')
    
    # Decode base64
    image_bytes = base64.b64decode(image_data.split(',')[1])
    image = Image.open(io.BytesIO(image_bytes))
    
    # Preprocess
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    
    # Predict
    predictions = model.predict(image)
    class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][class_idx])
    
    return jsonify({
        'class': CLASSES[class_idx],
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(debug=True)
```

---

## Support

If you encounter any issues during integration:

1. Check the browser console for errors
2. Verify API endpoint is accessible
3. Test API with Postman/curl first
4. Review the `/src/app/services/plantAI.ts` comments

---

## Next Steps

Once integrated, consider:
- [ ] Add image preprocessing for better accuracy
- [ ] Implement confidence thresholds
- [ ] Add multiple model support (A/B testing)
- [ ] Cache results for faster repeated analysis
- [ ] Add analytics to track model performance
- [ ] Implement feedback mechanism to improve model

---

Good luck with your model integration! 🚀🌱
