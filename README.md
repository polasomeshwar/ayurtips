# Prakriti - Ayurveda Lifestyle Website

An earthy, authentic Ayurveda lifestyle website built with Next.js, Vanilla CSS, and i18n support.

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v18 or higher recommended)
- npm or yarn

### Run Locally (Development)
To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
To build and start the optimized production version:

```bash
npm run build
npm start
```

## 📝 How to Add Blog Posts

The blog system is **dynamic**. You do not need to edit code to add new posts. Just add Markdown files.

### 1. Manual Method
- Create `.md` files in `src/content/en/` or `src/content/hi/`.
- Add frontmatter (title, date, excerpt) and content.

### 2. Automated AI Method (Daily)
This project includes a **GitHub Action** that automatically generates a new Ayurveda tip every day using Google Gemini AI.

#### Setup Instructions:
1.  **Get an API Key**: Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.
2.  **Add to GitHub Secrets**:
    -   Go to your repository on GitHub.
    -   Click **Settings** > **Secrets and variables** > **Actions**.
    -   Click **New repository secret**.
    -   Name: `GEMINI_API_KEY`
    -   Value: (Paste your API key here)
    -   Click **Add secret**.
3.  **Enable Workflow**: Go to the **Actions** tab in GitHub and ensure the "Daily Ayurveda Tip" workflow is enabled. It will run automatically at 00:00 UTC.

## 🎨 Customization

- **Colors & Fonts**: Edit `src/app/globals.css` to change CSS variables (colors, spacing).
- **Translations**: Edit `src/dictionaries/en.json` or `hi.json` to change UI text.
- **Ads**: Edit `src/components/AdUnit.tsx` to insert your real AdSense code.
