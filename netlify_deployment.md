# Deployment Guide: Hosting Next.js on Netlify

This guide provides step-by-step instructions to deploy the migrated **Mickey Crackers** Next.js application on **Netlify**, complete with support for Server-Side Rendering (SSR) and Serverless API routes (like `/api/orders`).

---

## 1. Prerequisites
1. A **Netlify** account (Free tier is sufficient).
2. The project repository pushed to a git provider (GitHub, GitLab, or Bitbucket).
3. The environment variables from your local `.env` file handy.

---

## 2. Automatic Next.js Runtime on Netlify
Netlify natively detects Next.js 13.x, 14.x, and 15.x apps. It installs the **Next.js Runtime** automatically during compilation, meaning:
* Server-side rendering (SSR) is automatically handled.
* Next.js API Routes (under `src/app/api/*`) are deployed automatically as serverless Netlify Functions.
* Static site generation (SSG) assets are served via Netlify's high-speed global CDN.

---

## 3. Step-by-Step Deployment Instructions

### Step 3.1: Connect Your Repository
1. Log in to the [Netlify App Console](https://app.netlify.com).
2. Click the **Add new site** button and select **Import an existing project**.
3. Choose your Git provider (e.g., GitHub) and authorize Netlify.
4. Select the `Mickey-Crackers` repository.

### Step 3.2: Configure Build Settings
Netlify will auto-detect the configuration. Verify that the settings match the following:
* **Branch to deploy**: `main` (or your preferred release branch).
* **Build command**: `npm run build`
* **Publish directory**: `.next`

### Step 3.3: Configure Environment Variables
Since the application relies on Firebase to connect to your database, you must configure the environment variables on Netlify:

1. Under the **Environment variables** section during setup (or by going to **Site configuration** > **Environment variables** after creating the site), click **Add a variable**.
2. Add the following variables exactly as they are defined in your local `.env` file:

| Variable Key | Description / Match Value |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase Client API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `mickey-crackers.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | e.g. `mickey-crackers` |
| `VITE_FIREBASE_STORAGE_BUCKET` | e.g. `mickey-crackers.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

> **Note**: Even though we are running on Next.js, our `next.config.mjs` maps these `VITE_` variables into the Next.js bundle environment. There is no need to rename them to `NEXT_PUBLIC_` inside Netlify.

### Step 3.4: Deploy the Site
1. Click **Deploy [Site Name]**.
2. Netlify will queue a build and compile the application. You can view the real-time logs by clicking on the build item in the dashboard.
3. Once completed, Netlify will assign a default subdomain (e.g. `handsome-marshmallow-12345.netlify.app`) where your site is live!

---

## 4. Custom Domains (Optional)
To set up a custom domain (e.g., `www.mickeycrackers.com`):
1. In the Netlify dashboard, go to **Site configuration** > **Domain management**.
2. Click **Add domain alias** or **Add custom domain**.
3. Enter your domain name.
4. Update your domain's DNS provider settings (Name Servers or CNAME record) to point to Netlify as instructed by the setup wizard.
5. Netlify will automatically provision a free, auto-renewing Let's Encrypt SSL Certificate.

---

## 5. Troubleshooting Build Failures
* **Node Version Mismatches**: If you run into build errors related to Node.js version, add an environment variable named `NODE_VERSION` in Netlify with the value `20` or `22`.
* **Caching Issues**: If you modify Tailwind assets or Firestore configuration and they don't appear, you can select **Clear cache and deploy site** from the **Deploys** tab in Netlify.
