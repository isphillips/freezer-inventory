# Deployment Guide

## Deploy to Render.com (Free Hosting)

Render.com is the recommended free hosting option with persistent storage for your SQLite database.

### What You Get
- 750 hours/month free (enough for one app running 24/7)
- Persistent disk storage for SQLite database and uploaded images
- Automatic HTTPS
- Note: Free tier spins down after 15 minutes of inactivity (takes 30-60 seconds to wake up)

### Prerequisites
1. GitHub account
2. Render.com account (free)
3. Your code pushed to a GitHub repository

---

## Step 1: Push Your Code to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
cd /Users/iphillips/dev/freezer-inventory
git init
git add .
git commit -m "Initial commit - Freezer Inventory App"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/freezer-inventory.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create Render Service

1. Go to [render.com](https://render.com) and sign up/log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if you haven't already
4. Select your `freezer-inventory` repository
5. Configure the service:

   - **Name**: `freezer-inventory` (or your preferred name)
   - **Region**: Choose the closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build && npm run migrate && npm run seed`
   - **Start Command**: `npm run start`
   - **Plan**: Select **"Free"**

6. Click **"Advanced"** and add environment variable:
   - Key: `NODE_ENV`
   - Value: `production`

7. Add persistent disk storage:
   - Click **"Add Disk"**
   - **Name**: `freezer-data`
   - **Mount Path**: `/opt/render/project/src`
   - **Size**: `1 GB` (free tier)

8. Click **"Create Web Service"**

---

## Step 3: Wait for Deployment

Render will now:
1. Clone your repository
2. Install dependencies
3. Build the frontend
4. Run database migrations
5. Seed the database (first deploy only)
6. Start the server

This takes 3-5 minutes. Watch the logs in the Render dashboard.

**Note:** The seed script automatically runs during build, but only seeds if the database is empty. Your data is safe on subsequent deploys.

---

## Step 4: Access Your App

1. Your app URL will be: `https://your-service-name.onrender.com`
2. Copy this URL and open it on your phone browser
3. Add to home screen for quick access:
   - **iPhone**: Tap Share → Add to Home Screen
   - **Android**: Tap Menu → Add to Home Screen

---

## Alternative Free Hosting Options

### Railway.app
- Free tier: $5 credit/month (usually enough for small apps)
- Pros: Faster cold starts than Render
- Cons: Credit-based, not truly unlimited

### Fly.io
- Free tier: 3 shared VMs, 3GB persistent storage
- Pros: Fast edge network, better performance
- Cons: More complex setup, requires Docker knowledge

---

## Troubleshooting

### App doesn't load after deployment
- Check Render logs for errors
- Make sure disk is properly mounted
- Verify NODE_ENV is set to "production"

### Database is empty
- Run the seed command in Render shell: `npm run seed`

### Images not loading
- Make sure the disk is mounted at `/opt/render/project/src`
- Check that uploads directory has write permissions

### App is slow to wake up
- This is normal on free tier - first request after inactivity takes 30-60 seconds

---

## Updating Your App

When you make changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. Render automatically detects the push and redeploys

3. Database and uploaded images are preserved across deployments

---

## Cost

**Render Free Tier:**
- Web Service: Free (with limitations)
- Disk Storage (1GB): Free
- Custom domain: Free
- SSL Certificate: Free

**Total Monthly Cost: $0**

After 750 hours, your app will be unavailable for the rest of the month. Upgrade to $7/month for unlimited hours if needed.
