# 🚀 Deployment Guide

## 1. Push to GitHub
First, you need to push this code to a GitHub repository.

1.  Create a new repository on [GitHub.com](https://github.com/new).
2.  Run these commands in your terminal (inside the `ayurtips` folder):

```bash
git remote add origin https://github.com/YOUR_USERNAME/ayurtips.git
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel (Recommended)
Vercel is the creators of Next.js and offers the best hosting for this project.

1.  Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your `ayurtips` repository.
4.  Current settings (Framework Preset: Next.js) are correct. Click **Deploy**.

## 3. Configure Automation
For the daily AI blog posts to work on the live site:

1.  Go to your GitHub Repository > **Settings**.
2.  Select **Secrets and variables** > **Actions**.
3.  Add a New Repository Secret:
    -   **Name**: `GEMINI_API_KEY`
    -   **Value**: Your Google AI API Key.

## 4. Ads
Once approved by Google AdSense:
1.  Open `src/components/AdUnit.tsx`.
2.  Replace the placeholder code with your actual AdSense script.
3.  Commit and push the changes.
