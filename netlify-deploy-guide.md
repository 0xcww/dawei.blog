# Deploy to Netlify Guide

## Option 1: Deploy via Git (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub)
4. Select your repository
5. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Step 3: Add Environment Variables (if needed)
1. In Netlify dashboard, go to Site settings → Environment variables
2. Add your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### Step 4: Custom Domain
1. In Netlify dashboard, go to Domain settings → Add custom domain
2. Enter your WordPress.com domain
3. Follow the DNS instructions to add records in WordPress.com:
   - Go to My Sites → Upgrades → Domains → Your Domain → DNS Records
   - Add A record: `@` → `75.2.60.5`
   - Add CNAME: `www` → `your-site-name.netlify.app`
4. Enable HTTPS (automatic with Let's Encrypt)

---

## Option 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Deploy
```bash
# Build the project
npm run build

# Deploy to Netlify (creates a new site)
netlify deploy --prod
```

When prompted:
- Create & configure a new site: Yes
- Team: Select your team
- Site name: Enter a unique name (or leave blank for random)
- Publish directory: `dist`

### Step 4: Note Your Site URL
After deployment, you'll get a URL like: `https://your-site-name.netlify.app`

### Step 5: Add Custom Domain (Optional)
```bash
netlify domains:add yourdomain.com
```

Then follow the DNS setup instructions above.

---

## Option 3: Drag & Drop Deploy

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Deploy
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop the `dist` folder
3. Your site is live!

**Note**: This method doesn't support automatic deployments. Use Git-based deploy for production sites.

---

## After Deployment

### Test Your Site
1. Visit your Netlify URL
2. Test all functionality (especially Supabase features)
3. Check browser console for errors

### Enable Auto-Deploy
If using Git deploy, every push to your main branch will automatically deploy to Netlify.

### Monitor Deployments
- View deploy logs in Netlify dashboard
- Set up deploy notifications
- Configure deploy contexts (production, preview, branch deploys)

---

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure `package.json` has all dependencies
- Verify Node version compatibility

### Environment Variables Not Working
- Make sure variables start with `VITE_`
- Redeploy after adding environment variables
- Check that variables are set in Netlify (not just `.env`)

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check CORS settings in Supabase dashboard
- Ensure Supabase URL and keys are valid

### Custom Domain Not Working
- Wait 24-48 hours for DNS propagation
- Verify DNS records in WordPress.com
- Check domain status in Netlify dashboard
- Make sure HTTPS is enabled (SSL/TLS certificate)
