# Deployment Guide - Digital Ocean App Platform

## Overview
Digital Ocean App Platform is the easiest all-in-one solution:
- **Frontend**: Static site (React/Vite)
- **Backend**: Node.js service
- **Database**: MongoDB Atlas (external)
- **Domain**: Built-in SSL & custom domains

**Cost**: ~$5-12/month total

---

## Prerequisites

1. GitHub account with your code pushed
2. Digital Ocean account ([sign up here](https://cloud.digitalocean.com/registrations/new))
3. Domain name: `sanunjara.com` (purchased from Namecheap, GoDaddy, etc.)
4. MongoDB Atlas database (free tier)

---

## Step 1: Prepare Your Repository

### 1.1 Update `.do/app.yaml`

Edit `.do/app.yaml` and replace:
1. **`your-username/sanun-jara-elite`** with your actual GitHub username/repo
2. **`MONGODB_URI`** with your MongoDB Atlas connection string
3. **`ADMIN_PASSWORD_HASH`** with a bcrypt hash of your admin password

To generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
```

### 1.2 Update API Base URL (Optional)

Your `src/api/http.ts` is already configured to work with relative URLs, which is perfect for Digital Ocean.

---

## Step 2: MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster (M0 tier)
3. **Database Access**: Create user + password
4. **Network Access**: Add `0.0.0.0/0` (Allow from anywhere)
5. Click **Connect** → **Drivers** → **Node.js**
6. Copy the connection string and save it for Step 3

---

## Step 3: Deploy on Digital Ocean

### Option A: Using App Spec (Recommended)

1. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Click **Create App**
3. Choose **GitHub** as source
4. Select your repository
5. Click **Edit App Spec** (instead of auto-detect)
6. Copy contents of `.do/app.yaml` and paste it
7. Update the environment variables with your actual values
8. Click **Save** → **Next**
9. Name your app: `sanunjara`
10. Click **Create Resources**

### Option B: Manual Setup

1. **Create Backend Service**:
   - Source: GitHub repo
   - Root Directory: `server`
   - Build: `npm install`
   - Run: `npm start`
   - Environment Variables:
     ```
     PORT=5050
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<random-secret>
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD_HASH=<bcrypt-hash>
     CORS_ORIGIN=https://www.sanunjara.com
     ```

2. **Create Frontend Static Site**:
   - Source: Same repo
   - Root Directory: `/` (root)
   - Build: `npm install && npm run build`
   - Output: `dist`
   - Catchall: `index.html`

3. **Configure Routes**:
   - Backend routes: `/api`, `/uploads`
   - Frontend route: `/`

---

## Step 4: Connect Your Domain

### 4.1 Add Domain in Digital Ocean

1. In App Dashboard → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `www.sanunjara.com`
4. Digital Ocean will show you DNS records to add

### 4.2 Configure DNS at Your Registrar

Go to your domain registrar (Namecheap, GoDaddy, Cloudflare) and add:

**Option 1: Using CNAME (Recommended for www)**
```
Type: CNAME
Name: www
Value: sanunjara.ondigitalocean.app  (or your app URL)
TTL: Automatic
```

**Option 2: Using A Record (for root domain)**
```
Type: A
Name: @
Value: <Digital Ocean provides this IP>
TTL: Automatic
```

### 4.3 Root Domain Redirect (sanunjara.com → www.sanunjara.com)

If your registrar supports redirects:
1. Set up URL redirect: `sanunjara.com` → `https://www.sanunjara.com`
2. Or use Digital Ocean's alias domain feature in the app spec

---

## Step 5: SSL/HTTPS

Digital Ocean automatically provides SSL certificates for:
- Your `.ondigitalocean.app` subdomain
- Custom domains (after DNS propagates)

**Just wait 5-10 minutes after adding DNS records!**

---

## Step 6: Verify Deployment

1. Visit `https://www.sanunjara.com`
2. Check that pages load
3. Test admin login: `/admin/login`
4. Test API: Open browser console → Network tab

---

## Updating Your App

### Automatic Deploys
Digital Ocean auto-deploys when you push to GitHub main branch.

### Manual Deploy
1. Go to App Dashboard
2. Click **Deploy** button
3. Or use doctl CLI:
   ```bash
   doctl apps create-deployment <app-id>
   ```

---

## Troubleshooting

### App Won't Deploy?
- Check **Runtime Logs** in Dashboard
- Verify `server/package.json` has `start` script
- Ensure MongoDB URI is correct

### API Not Working?
- Check backend service logs
- Verify `CORS_ORIGIN` matches your domain
- Test API directly: `https://your-app.ondigitalocean.app/api/pages`

### Domain Not Working?
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- Ensure SSL certificate issued (takes 5-10 min)
- Verify no conflicting DNS records

### Images Not Loading?
- Check `/uploads` route is configured
- Verify uploads folder exists on backend
- Check file permissions

---

## Cost Breakdown

| Component | Tier | Monthly Cost |
|-----------|------|--------------|
| Backend Service | Basic XXS (512MB RAM) | $5 |
| Frontend Static | Free | $0 |
| MongoDB Atlas | M0 Free | $0 |
| Domain | .com registration | ~$10-15/year |

**Total: $5/month** (plus domain yearly)

---

## Scaling (When You Need It)

When your traffic grows:
1. **Backend**: Upgrade to Basic XS ($10) or larger
2. **Database**: Upgrade MongoDB Atlas to M10 ($57/month)
3. **CDN**: Add Digital Ocean Spaces for assets

---

## Useful Commands

```bash
# Install doctl (Digital Ocean CLI)
brew install doctl  # macOS
# or download from https://github.com/digitalocean/doctl

# Authenticate
doctl auth init

# List apps
doctl apps list

# View logs
doctl apps logs <app-id>

# Create deployment
doctl apps create-deployment <app-id>
```

---

## Need Help?

- [Digital Ocean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Digital Ocean Community](https://www.digitalocean.com/community/questions)

Happy deploying! 🚀
