# Deploying JOBICA FOODS to Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

## Deployment Steps

### 1. Push to GitHub
Make sure all your changes are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **jobica-foods** (or your preferred name)
   - In which directory is your code located? **./** (press Enter)
   - Want to override the settings? **N**

5. For production deployment:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository: `https://github.com/AboneChima/JobicaFoods.git`
3. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (leave as default)
   - Build Command: **next build** (auto-detected)
   - Output Directory: **.next** (auto-detected)
4. Click **Deploy**

### 3. Environment Variables (if needed in future)
If you add environment variables later:
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables

### 4. Custom Domain (Optional)
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain and follow DNS configuration instructions

## Post-Deployment

Your app will be live at: `https://your-project-name.vercel.app`

### Automatic Deployments
- Every push to `main` branch will trigger a production deployment
- Pull requests will create preview deployments

## Troubleshooting

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Run `npm run build` locally to test

### Image Issues
- Make sure all images are in the `public/images` folder
- Image paths should start with `/images/`

### API Routes
- All API routes in `pages/api` will work automatically
- They'll be deployed as serverless functions

## Support
For issues, check:
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Issues: https://github.com/AboneChima/JobicaFoods/issues
