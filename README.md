# 🌿 PlantCare AI

A mobile-first web application for diagnosing plant diseases using AI. Built with React, TypeScript, and Tailwind CSS.

![PlantCare AI](https://img.shields.io/badge/Status-MVP%20Ready-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## ✨ Features

- 📷 **Image Capture** - Take photos with camera or upload from gallery
- 🤖 **AI Analysis** - Detect plant diseases with confidence scores
- 💡 **Smart Recommendations** - Get actionable care instructions
- 💾 **Save History** - Track all your plant diagnoses
- 📤 **Share Results** - Share diagnosis with experts or friends
- 📱 **Mobile First** - Optimized for farmers and gardeners on the go
- ♿ **Accessible** - Large touch targets, clear labels, high contrast

## 🎯 User Flow

1. Open app → Splash screen
2. Upload/capture plant image
3. Confirm image quality
4. AI analyzes image (2-3s)
5. View diagnosis + recommendations
6. Save or share results
7. Access history anytime

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app currently runs in **mock mode** with simulated AI responses. This is perfect for:
- Testing the UI/UX
- Developing features
- Demo purposes

You'll see a "Mock Mode" badge at the bottom left and a settings icon (⚙️) at the bottom right.

## 🔌 Integrating Your Model

**Ready to connect your trained model?** It's super easy!

### Option 1: Quick (2 minutes)
Read: `/QUICK_INTEGRATION.md`

### Option 2: Detailed (5 minutes)
Read: `/MODEL_INTEGRATION_GUIDE.md`

### TL;DR

1. Deploy your model as an API endpoint
2. Open `/src/app/services/plantAI.ts`
3. Update these 2 lines:
   ```typescript
   const API_ENDPOINT = 'https://your-api.com/predict';
   const USE_MOCK_DATA = false;
   ```
4. Done! 🎉

Your model just needs to return:
```json
{
  "class": "Disease Name",
  "confidence": 0.95
}
```

## 📁 Project Structure

```
src/app/
├── screens/           # All app screens
│   ├── Splash.tsx     # Welcome screen
│   ├── Home.tsx       # Upload/capture screen
│   ├── ImageConfirmation.tsx
│   ├── Analyzing.tsx  # Loading screen
│   ├── Result.tsx     # Diagnosis display
│   └── History.tsx    # Saved diagnoses
├── services/
│   └── plantAI.ts     # 🔥 Model integration point
├── utils/
│   └── diseases.ts    # Disease database
├── components/
│   ├── DevBadge.tsx   # Dev mode indicator
│   ├── DevSettings.tsx # Dev tools panel
│   └── Toaster.tsx    # Notifications
├── routes.tsx         # React Router config
└── App.tsx           # Main app
```

## 🛠️ Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **React Router 7** - Navigation
- **Tailwind CSS v4** - Styling
- **Motion** - Animations
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## 📚 Documentation

- [Quick Integration Guide](QUICK_INTEGRATION.md) - 2-minute setup
- [Full Integration Guide](MODEL_INTEGRATION_GUIDE.md) - Detailed instructions
- [API Contract](API_CONTRACT.md) - Backend requirements
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Pre-launch checklist

## 🎨 Design Principles

- ✅ Clean and minimal
- ✅ Mobile-first (responsive)
- ✅ Accessible (WCAG compliant)
- ✅ Instant feedback
- ✅ Single focus per screen
- ✅ Large touch targets (44px+)
- ✅ Clear visual hierarchy

## 🧪 Testing

### With Mock Data (Current)
```bash
npm run dev
# Upload any plant image
# Get random disease results
```

### With Real Model
```typescript
// In /src/app/services/plantAI.ts
const USE_MOCK_DATA = false;
const API_ENDPOINT = 'http://localhost:5000/predict';
```

## 📱 Screens

1. **Splash** - Animated welcome screen
2. **Home** - Upload/capture interface
3. **Confirm** - Image preview with retake option
4. **Analyzing** - AI processing with progress steps
5. **Result** - Disease diagnosis with recommendations
6. **History** - All saved diagnoses with filters

## 🔧 Configuration

### Disease Database
Edit `/src/app/utils/diseases.ts` to add/modify diseases:

```typescript
{
  id: 'tomato-early-blight',
  name: 'Tomato Early Blight',
  recommendations: [
    'Remove infected leaves',
    'Apply fungicide'
  ],
  severity: 'medium'
}
```

### API Service
Edit `/src/app/services/plantAI.ts` to configure model integration:

```typescript
const API_ENDPOINT = 'https://your-api.com/predict';
const USE_MOCK_DATA = false; // Toggle mock/real mode
```

## 🚢 Deployment

### Build
```bash
npm run build
```

### Deploy Options
- **Vercel** - `vercel`
- **Netlify** - `netlify deploy --prod`
- **AWS S3 + CloudFront**
- **Any static host**

See [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) for details.

## 🤝 Model Requirements

Your backend needs to:
1. Accept POST requests with image data
2. Return JSON with `class` and `confidence`
3. Support CORS from your frontend domain
4. Respond within 10 seconds

See [API Contract](API_CONTRACT.md) for full specification.

## 🐛 Troubleshooting

### CORS Issues
Configure your backend to allow requests from your frontend domain.

### Images Not Uploading
Check browser console for errors. Ensure image is < 10MB.

### API Not Responding
Verify API endpoint is accessible and returns correct format.

### Mock Mode Not Disabled
Ensure you set `USE_MOCK_DATA = false` in `/src/app/services/plantAI.ts`

## 📝 License

This project is ready for your use. Integrate your model and deploy!

## 🌟 Features Coming Soon

- [ ] Multiple language support
- [ ] Offline mode with PWA
- [ ] Cloud sync with Supabase
- [ ] Expert consultation booking
- [ ] Plant health tracking over time
- [ ] Community forum

## 💬 Support

Need help integrating your model?

1. Check `/QUICK_INTEGRATION.md`
2. Review `/MODEL_INTEGRATION_GUIDE.md`
3. Verify `/API_CONTRACT.md` requirements

## 🎉 Ready to Deploy?

Follow the [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) and you're good to go!

---

Made with 🌱 for farmers, gardeners, and plant enthusiasts.
