# 🚀 Deployment Guide for Planify

## ✅ Pre-Deployment Checklist

### Backend (Already Deployed)
- ✅ Backend deployed at: `https://planifyserver-gold.vercel.app`
- ✅ MongoDB connection working
- ✅ API endpoints accessible

### Frontend Deployment Steps

#### 1. Environment Configuration
```bash
# Ensure .env file has correct backend URL
VITE_API_URL=https://planifyserver-gold.vercel.app
```

#### 2. Build the Project
```bash
cd client
npm install
npm run build
```

#### 3. Deploy to Vercel
```bash
# Option 1: Vercel CLI
npm i -g vercel
vercel --prod

# Option 2: Connect GitHub repo to Vercel dashboard
# - Go to vercel.com
# - Import your GitHub repository
# - Set environment variables in Vercel dashboard
```

#### 4. Environment Variables in Vercel
Set these in your Vercel project settings:
- `VITE_API_URL` = `https://planifyserver-gold.vercel.app`

## 🔧 Common Issues & Solutions

### Issue 1: API Calls Failing
**Solution:** Check browser console for CORS errors
- Ensure backend has proper CORS configuration
- Verify API URL is correct

### Issue 2: 404 on Refresh
**Solution:** `vercel.json` file handles SPA routing
- Already included in the project

### Issue 3: Environment Variables Not Working
**Solution:** 
- Ensure variables start with `VITE_`
- Rebuild after changing environment variables
- Check Vercel dashboard environment settings

### Issue 4: Build Errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🌐 Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: `VITE_API_URL`

### GitHub Pages (with GitHub Actions)
1. Create `.github/workflows/deploy.yml`
2. Configure build and deploy steps
3. Set repository secrets for environment variables

## 🔍 Testing Deployment

### 1. Check API Connection
Open browser console and verify:
- No CORS errors
- API calls returning data
- Authentication working

### 2. Test All Features
- ✅ User registration/login
- ✅ Task CRUD operations
- ✅ Data export/import
- ✅ Responsive design

### 3. Performance Check
- ✅ Fast loading times
- ✅ Smooth animations
- ✅ Mobile responsiveness

## 📱 Mobile Testing
Test on various devices:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad/Android)

## 🎯 Production Optimizations

### Already Implemented
- ✅ Code splitting with Vite
- ✅ CSS optimization with Tailwind
- ✅ Image optimization
- ✅ Gzip compression
- ✅ Security headers in vercel.json

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Check bundle size with `npm run build`

## 🔒 Security Considerations

### Already Implemented
- ✅ JWT token authentication
- ✅ HTTPS only in production
- ✅ Security headers
- ✅ Input validation
- ✅ XSS protection

## 📊 Analytics (Optional)
Add Google Analytics or similar:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🎉 Go Live!
Once deployed, your Planify app will be available at:
- Vercel: `https://your-project-name.vercel.app`
- Custom domain: Configure in Vercel dashboard