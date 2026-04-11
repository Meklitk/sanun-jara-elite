# Deployment Guide - Vercel + Railway + MongoDB Atlas

## Overview
- **Frontend**: Vercel (www.sanunjara.com)
- **Backend**: Railway (sanunjara-api.up.railway.app)
- **Database**: MongoDB Atlas

---

## Step 1: MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Sign up
2. Create a **Free Cluster** (M0 tier)
3. **Database Access**: Create a user + password
4. **Network Access**: Add `0.0.0.0/0` (Allow from anywhere)
5. Click **Connect** → **Drivers** → **Node.js**
6. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sanunjara?retryWrites=true&w=majority
   ```

---

## Step 2: Railway (Backend) Deployment

1. Go to [railway.app](https://railway.app) → Login with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. Click the service → **Settings**:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
5. Go to **Variables** tab, add these:
   ```
   PORT=5050
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sanunjara?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-key-change-this
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=(bcrypt hash of your password)
   ```
   
   To generate password hash locally:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
   ```

6. Deploy! Copy your Railway URL: `https://sanunjara-api.up.railway.app`

---

## Step 3: Vercel (Frontend) Deployment

### 3.1 Update vercel.json
Replace the Railway URL in `vercel.json` with your actual Railway URL.

### 3.2 Push to GitHub
```bash
git add .
git commit -m "Deployment config"
git push origin main
```

### 3.3 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Login with GitHub
2. Click **Add New Project** → Import your repo
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables** (Optional - if not using vercel.json proxy):
   ```
   VITE_API_URL=https://sanunjara-api.up.railway.app
   ```
5. Click **Deploy**

---

## Step 4: Custom Domain (www.sanunjara.com)

### 4.1 Vercel Domain Setup
1. In Vercel Dashboard → Select your project
2. Go to **Settings** → **Domains**
3. Add `www.sanunjara.com`
4. Follow Vercel's DNS instructions:
   - Add CNAME record: `www` → `cname.vercel-dns.com`

### 4.2 Root Domain Redirect (Optional)
To redirect `sanunjara.com` → `www.sanunjara.com`:

1. Go to your **Domain Registrar** (GoDaddy, Namecheap, etc.)
2. Add these DNS records:
   
   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | CNAME | www | cname.vercel-dns.com | Auto |
   | A | @ | 76.76.21.21 | Auto |
   
   The A record points to Vercel's IP for root domain.

3. In Vercel → Add both `sanunjara.com` and `www.sanunjara.com`
4. Vercel will automatically redirect non-www to www

---

## Step 5: CORS Configuration (Important!)

In Railway, add this environment variable:
```
CORS_ORIGIN=https://www.sanunjara.com
```

Or for multiple origins:
```
CORS_ORIGIN=https://www.sanunjara.com,https://sanunjara.com
```

Update your server's `index.js` to use this variable.

---

## Testing After Deployment

1. Visit `https://www.sanunjara.com`
2. Check that pages load correctly
3. Test login to admin: `/admin/login`
4. Test API: Open browser console → Network tab → should see 200 OK for `/api/pages`

---

## Troubleshooting

### API not working?
- Check Railway logs: Dashboard → Deployments → View Logs
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check CORS_ORIGIN matches your Vercel domain

### Images not loading?
- Ensure `/uploads` folder is properly proxied in vercel.json
- Check that Railway has the uploads folder with correct permissions

### SSL/HTTPS issues?
- Vercel provides SSL automatically
- Railway provides SSL automatically
- Just make sure you're using `https://` URLs

---

## Estimated Costs

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Free Hobby | $0 |
| Railway | Free Tier (500 hrs) | $0 |
| MongoDB Atlas | M0 Free | $0 |
| Domain | .com registration | ~$10-15/year |

**Total: FREE** (just pay for domain yearly)

---

## Next Steps

After deployment:
1. Set up Google Analytics
2. Configure SEO meta tags
3. Test all functionality
4. Share your beautiful website!
