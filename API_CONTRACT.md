# 📡 PlantCare AI - API Contract

This document defines the contract between the frontend and your model backend.

## Endpoint

```
POST /predict
```

## Request Format

### Headers
```
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_KEY (optional)
```

### Body (Form Data)
```typescript
{
  image: string  // Base64 encoded image with data URL prefix
               // Example: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Alternative: File Upload
If you prefer file upload instead of base64:
```typescript
{
  file: File  // Actual image file object
}
```

## Response Format

### Success Response (200 OK)
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

**Field Descriptions:**
- `class` (required): String - The detected disease name
- `confidence` (required): Number - Confidence score between 0 and 1
- `recommendations` (optional): Array of strings - Care instructions

### Error Response (4xx/5xx)
```json
{
  "error": "Invalid image format",
  "message": "Please upload a valid JPEG or PNG image"
}
```

## Supported Image Formats
- JPEG / JPG
- PNG
- Maximum size: 10MB (configurable)

## Example Requests

### Using cURL (Base64)
```bash
curl -X POST https://your-api.com/predict \
  -H "Content-Type: multipart/form-data" \
  -F "image=data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```

### Using cURL (File Upload)
```bash
curl -X POST https://your-api.com/predict \
  -H "Content-Type: multipart/form-data" \
  -F "file=@plant_image.jpg"
```

### Using JavaScript (Frontend)
```javascript
const formData = new FormData();
formData.append('image', imageBase64);

const response = await fetch('https://your-api.com/predict', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.class, result.confidence);
```

## Response Timing
- Expected: 1-3 seconds
- Maximum: 10 seconds (frontend timeout)

## Disease Classes

Your model should be able to detect these classes (or similar):

1. Tomato Early Blight
2. Tomato Late Blight
3. Potato Early Blight
4. Potato Late Blight
5. Corn Common Rust
6. Wheat Leaf Rust
7. Grape Black Rot
8. Apple Scab
9. Healthy Plant
10. (Add your custom classes)

## Confidence Thresholds

Frontend behavior based on confidence:
- **0.9 - 1.0**: High confidence (green badge)
- **0.7 - 0.89**: Medium confidence (yellow badge)
- **0.5 - 0.69**: Low confidence (orange badge)
- **< 0.5**: Very uncertain (red badge, suggest retake)

## Error Handling

Frontend handles these scenarios:
- Network timeout (10s)
- Invalid response format
- HTTP errors (4xx/5xx)
- CORS issues
- Large image files

Make sure your backend returns appropriate status codes:
- `200`: Success
- `400`: Bad request (invalid image)
- `413`: Image too large
- `500`: Server error
- `503`: Model unavailable

## Rate Limiting (Optional)

If you implement rate limiting, use standard headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Security Recommendations

1. **Use HTTPS** - Always encrypt in transit
2. **Add authentication** - API keys or JWT tokens
3. **Validate inputs** - Check image format and size
4. **Rate limiting** - Prevent abuse
5. **CORS configuration** - Allow only your frontend domain

## Testing Your API

Test with this sample request:
```bash
# Download a test image
curl -o test_leaf.jpg https://example.com/sample_leaf.jpg

# Convert to base64
base64 test_leaf.jpg > test_leaf_b64.txt

# Test your API
curl -X POST https://your-api.com/predict \
  -F "image=data:image/jpeg;base64,$(cat test_leaf_b64.txt)"
```

Expected response:
```json
{
  "class": "Some Disease Name",
  "confidence": 0.XX
}
```

## Frontend Integration

Once your API is ready and follows this contract:

1. Update `API_ENDPOINT` in `/src/app/services/plantAI.ts`
2. Set `USE_MOCK_DATA = false`
3. Test with real images
4. Deploy!

That's it! The frontend will handle everything else. 🚀
