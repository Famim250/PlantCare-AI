# 🏗️ PlantCare AI Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER DEVICE                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    PlantCare AI                       │  │
│  │                  (React Frontend)                     │  │
│  │                                                       │  │
│  │  📱 UI Screens                                        │  │
│  │  ├─ Splash                                           │  │
│  │  ├─ Home (Upload/Capture)                           │  │
│  │  ├─ Image Confirmation                              │  │
│  │  ├─ Analyzing                                       │  │
│  │  ├─ Result                                         │  │
│  │  └─ History                                       │  │
│  │                                                   │  │
│  │  🔌 Services Layer                               │  │
│  │  └─ plantAI.ts ────────┐                       │  │
│  │                         │                      │  │
│  │  💾 Storage            │                     │  │
│  │  ├─ sessionStorage     │                    │  │
│  │  └─ localStorage       │                   │  │
│  └───────────────────────┼───────────────────┘  │
│                          │                       │
└──────────────────────────┼───────────────────────┘
                           │
                           │ HTTPS POST
                           │ /predict
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      YOUR BACKEND API                       │
│                                                             │
│  🔧 API Endpoint                                           │
│  POST /predict                                            │
│                                                          │
│  📥 Receives: Image (base64)                           │
│  📤 Returns: { class, confidence }                    │
│                                                      │
│  🤖 Your ML Model                                   │
│  ├─ Load image                                     │
│  ├─ Preprocess                                    │
│  ├─ Run inference                                │
│  └─ Return prediction                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Upload Flow
```
User
  │
  ├─ Take Photo / Upload
  │
  ▼
Home Screen
  │
  ├─ Store image in sessionStorage
  │
  ▼
Image Confirmation
  │
  ├─ User confirms image
  │
  ▼
Analyzing Screen
  │
  ├─ Call analyzeImage(image)
  │
  ▼
plantAI.ts Service
  │
  ├─ if USE_MOCK_DATA: return mock
  ├─ else: fetch(API_ENDPOINT, image)
  │
  ▼
YOUR MODEL API
  │
  ├─ Decode image
  ├─ Preprocess
  ├─ model.predict()
  ├─ Return result
  │
  ▼
plantAI.ts Service
  │
  ├─ Map response to Disease type
  ├─ Store in sessionStorage
  │
  ▼
Result Screen
  │
  ├─ Display disease + confidence
  ├─ Show recommendations
  ├─ User can save/share
  │
  ▼
localStorage (if saved)
  │
  ▼
History Screen
```

## Component Hierarchy

```
App.tsx
├── RouterProvider
│   ├── Splash (/)
│   ├── Home (/home)
│   ├── ImageConfirmation (/confirm)
│   ├── Analyzing (/analyzing)
│   ├── Result (/result)
│   └── History (/history)
├── Toaster
├── DevBadge
└── DevSettings
```

## Service Layer Architecture

```
services/
└── plantAI.ts
    ├── analyzeImage()         ← Main entry point
    │   ├── mockAnalyzeImage() ← For testing
    │   └── realAnalyzeImage() ← For production
    │
    ├── preprocessImage()       ← Optional preprocessing
    ├── validateImage()         ← Input validation
    └── mapModelOutputToDisease() ← Response mapping
```

## State Management

### Session Storage (Temporary)
```
current-image          → Current image being analyzed
analysis-result        → Result from AI analysis
```

### Local Storage (Persistent)
```
plantcare-diagnoses    → Array of saved diagnoses
```

### Diagnosis Structure
```typescript
{
  id: string              // Unique ID
  timestamp: number       // Unix timestamp
  imageUrl: string        // Base64 image
  disease: Disease        // Disease object
  confidence: number      // 0-1 confidence score
}
```

## API Integration Points

### Current (Mock Mode)
```
User → Frontend → Mock Data → Frontend → User
```

### Production (Real Model)
```
User → Frontend → Your API → ML Model → API → Frontend → User
```

## File Organization

```
src/app/
├── screens/              # UI Screens (6 total)
│   ├── Splash.tsx
│   ├── Home.tsx
│   ├── ImageConfirmation.tsx
│   ├── Analyzing.tsx
│   ├── Result.tsx
│   └── History.tsx
│
├── services/            # Business Logic
│   └── plantAI.ts      # 🔥 MODEL INTEGRATION HERE
│
├── utils/              # Helpers & Data
│   └── diseases.ts     # Disease database
│
├── components/         # Reusable Components
│   ├── DevBadge.tsx
│   ├── DevSettings.tsx
│   ├── Toaster.tsx
│   └── ui/            # UI Components
│
├── routes.tsx         # Route Configuration
└── App.tsx           # Root Component
```

## Key Technologies

```
Frontend Stack:
├── React 18.3         # UI Library
├── TypeScript         # Type Safety
├── React Router 7     # Navigation
├── Tailwind CSS v4    # Styling
├── Motion             # Animations
├── Lucide React       # Icons
└── Sonner            # Notifications

Build Tools:
├── Vite              # Build Tool
└── pnpm              # Package Manager
```

## Request/Response Flow

### Request to Your API
```javascript
POST https://your-api.com/predict

Headers:
  Content-Type: multipart/form-data
  Authorization: Bearer YOUR_API_KEY (optional)

Body:
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```

### Response from Your API
```javascript
{
  "class": "Tomato Early Blight",
  "confidence": 0.95,
  "recommendations": [    // Optional
    "Remove infected leaves",
    "Apply fungicide"
  ]
}
```

## Error Handling

```
Error Scenarios:
├── Network Error → Show error toast → Return to home
├── Invalid Image → Validation message → Retry
├── Low Confidence → Show uncertainty → Suggest retake
├── API Timeout → Error message → Retry option
└── Server Error → Generic error → Contact support
```

## Performance Considerations

### Frontend
- Image compression before upload
- Lazy loading screens
- Optimized animations
- Session storage for temp data

### Backend (Your Model)
- Fast preprocessing
- Efficient model inference
- Response caching
- CDN for static assets

## Security Architecture

```
Frontend:
├── Input validation (file size, type)
├── XSS protection (React auto-escapes)
└── HTTPS only

Backend (Your Responsibility):
├── HTTPS/TLS
├── API authentication
├── Rate limiting
├── Input validation
└── CORS configuration
```

## Deployment Architecture

### Frontend (Static)
```
Vercel / Netlify / AWS S3
├── React app (static files)
├── CDN distribution
└── Custom domain + SSL
```

### Backend (Your Model)
```
Your Choice:
├── AWS Lambda + API Gateway (Serverless)
├── Google Cloud Run (Containers)
├── Heroku / Railway (PaaS)
└── Your own server (VPS)
```

## Integration Checklist

```
✅ Frontend (Done)
   ├── All screens implemented
   ├── Navigation working
   ├── State management ready
   ├── API service prepared
   └── UI/UX polished

⏳ Backend (Your Task)
   ├── Deploy ML model
   ├── Create API endpoint
   ├── Implement preprocessing
   ├── Return correct format
   └── Configure CORS

🔧 Integration (2 minutes)
   ├── Update API_ENDPOINT
   ├── Set USE_MOCK_DATA = false
   └── Test and deploy
```

## Scaling Considerations

### For High Traffic:
```
Frontend:
├── CDN caching
├── Image optimization
└── Bundle splitting

Backend:
├── Load balancer
├── Model caching
├── Batch processing
├── Auto-scaling
└── Database for history (optional)
```

## Future Enhancements

```
Possible Additions:
├── PWA (offline support)
├── Push notifications
├── Multi-language support
├── Cloud sync (Supabase)
├── User accounts
├── Expert consultation
└── Community features
```

## Summary

**Current State:**
- ✅ Frontend: 100% complete
- ✅ Mock data: Working perfectly
- ✅ Integration: Ready and waiting

**Your Task:**
- 🔧 Deploy your model
- 🔧 Update API endpoint
- 🔧 Test integration

**Result:**
- 🚀 Production-ready app!

---

See [QUICK_INTEGRATION.md](QUICK_INTEGRATION.md) for next steps.
