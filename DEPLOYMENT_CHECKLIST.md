# ✅ Deployment Checklist

Before deploying PlantCare AI to production, make sure you've completed these steps:

## Pre-Deployment

### Model Integration
- [ ] Model is deployed and accessible via HTTPS endpoint
- [ ] API endpoint is tested and returns correct format
- [ ] Updated `API_ENDPOINT` in `/src/app/services/plantAI.ts`
- [ ] Changed `USE_MOCK_DATA` to `false`
- [ ] Tested with real plant images
- [ ] Verified confidence scores are reasonable
- [ ] Error handling works properly

### Security
- [ ] API uses HTTPS (not HTTP)
- [ ] Authentication/API keys configured (if required)
- [ ] CORS is properly configured on backend
- [ ] Rate limiting implemented on API
- [ ] No sensitive data in frontend code
- [ ] Environment variables for secrets (if any)

### Performance
- [ ] Images are compressed before upload
- [ ] API response time is acceptable (< 5s)
- [ ] Loading states work smoothly
- [ ] App works on slow 3G networks
- [ ] Large images are handled gracefully

### Testing
- [ ] Tested on multiple devices (mobile, tablet, desktop)
- [ ] Tested on different browsers (Chrome, Safari, Firefox)
- [ ] Tested camera capture on mobile
- [ ] Tested gallery upload on desktop
- [ ] Tested save/share functionality
- [ ] Tested history screen with multiple items
- [ ] Tested offline behavior (graceful error)

### UI/UX
- [ ] All screens are responsive
- [ ] Animations are smooth on mobile
- [ ] Buttons have proper touch targets (min 44px)
- [ ] Text is readable (good contrast)
- [ ] Icons have proper labels
- [ ] Loading states are clear
- [ ] Error messages are user-friendly

### Code Cleanup
- [ ] Removed `DevBadge` component (or set to `show={false}`)
- [ ] Removed console.log statements
- [ ] Removed commented-out code
- [ ] Updated disease database with your model's classes
- [ ] Added all disease recommendations
- [ ] Verified all imports are used

### Documentation
- [ ] Updated disease list in `/src/app/utils/diseases.ts`
- [ ] API contract matches your implementation
- [ ] Team knows how to update the model
- [ ] Instructions for adding new diseases
- [ ] Contact info for support/issues

## Deployment

### Build
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Bundle size is reasonable

### Frontend Hosting
Choose a platform and deploy:

#### Option 1: Vercel
```bash
npm install -g vercel
vercel
```

#### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option 3: AWS S3 + CloudFront
- Upload build folder to S3
- Configure CloudFront distribution
- Set up custom domain

### Environment Variables
If using any:
- [ ] Set production API endpoint
- [ ] Set analytics keys (if any)
- [ ] Configure error tracking (Sentry, etc.)

### Domain & SSL
- [ ] Custom domain configured
- [ ] SSL certificate is active
- [ ] HTTPS redirect enabled
- [ ] WWW redirect configured (if needed)

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry/Bugsnag)
- [ ] Set up analytics (Google Analytics/Plausible)
- [ ] Monitor API usage and costs
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors

### Performance
- [ ] Test with Lighthouse (aim for > 90)
- [ ] Verify Core Web Vitals
- [ ] Check mobile performance
- [ ] Test on real devices

### User Testing
- [ ] Get feedback from target users (farmers/gardeners)
- [ ] Test with various plant images
- [ ] Verify diagnosis accuracy
- [ ] Check if recommendations are helpful
- [ ] Gather improvement suggestions

### Maintenance Plan
- [ ] Plan for model updates
- [ ] Create process for adding new diseases
- [ ] Schedule regular testing
- [ ] Set up feedback collection
- [ ] Plan for scaling if needed

## Quick Commands

### Development
```bash
npm run dev      # Start development server
```

### Production Build
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

### Testing API Integration
```bash
# In /src/app/services/plantAI.ts
const USE_MOCK_DATA = false;  # Test with real model
const USE_MOCK_DATA = true;   # Test with mock data
```

## Rollback Plan

If issues arise after deployment:

1. **Frontend issues**: Revert to previous deployment
2. **API issues**: Toggle `USE_MOCK_DATA = true` temporarily
3. **Critical bugs**: Take app offline with maintenance page

## Support Resources

- **Integration Guide**: `/MODEL_INTEGRATION_GUIDE.md`
- **Quick Start**: `/QUICK_INTEGRATION.md`
- **API Contract**: `/API_CONTRACT.md`
- **This Checklist**: `/DEPLOYMENT_CHECKLIST.md`

---

## Final Check

Before going live, ask yourself:

✅ Can users upload images easily?
✅ Does the analysis work correctly?
✅ Are results accurate and helpful?
✅ Is the app fast and responsive?
✅ Can users save and share results?
✅ Does it work on all devices?

If yes to all → **You're ready to deploy!** 🚀

---

Good luck with your launch! 🌱✨
