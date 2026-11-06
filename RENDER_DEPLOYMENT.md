# 🚀 Render Deployment Guide for Annadaan

This repository is pre-configured for seamless, zero-friction deployment on **[Render](https://render.com)**.

---

## 🛠️ Important: Fix for `Command failed with exit code 127`

If you saw:
```text
error Command failed with exit code 127.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
==> Build failed 😞
```

### Why did this happen?
1. **Render Defaults to Yarn without lockfile**: Render's build image tries to run `yarn build` by default if a root lockfile is missing.
2. **`NODE_ENV=production` Omission**: In cloud environments, package managers skip `devDependencies` when `NODE_ENV=production`. Because Vite was in `devDependencies`, the `vite` binary was omitted, causing `vite: not found` (exit code 127).

### How We Fixed It:
- ✅ Moved `vite`, `@vitejs/plugin-react`, `tailwindcss`, and `postcss` to production `dependencies` in `frontend/package.json`.
- ✅ Added root `package-lock.json` so Render automatically selects `npm`.
- ✅ Configured bulletproof build commands using directory traversal (`cd backend && npm install && cd ../frontend && npm install && npm run build`).

---

## ⚡ Option 1: 1-Click Render Blueprint (Recommended)

Render Blueprints read [`render.yaml`](./render.yaml) and automatically provision:
1. `annadaan-api`: Node.js Express REST API Web Service
2. `annadaan-web`: React 18 + Vite Static Site hosted on global CDN

### Steps:
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **"New +"** in the top navigation and select **"Blueprint"**.
3. Connect your GitHub repository:
   ```text
   https://github.com/kshatriyanandhu-commits/Annadaan
   ```
4. Render detects `render.yaml` and sets up both services with zero configuration.
5. Click **"Apply"**.

---

## 🌐 Option 2: Single All-in-One Web Service (Free Tier)

Runs both the Express API and the React SPA under a single Render free-tier URL.

### Settings in Render Dashboard:
1. Click **"New +"** $\rightarrow$ **"Web Service"**.
2. Select your repository: `https://github.com/kshatriyanandhu-commits/Annadaan`.
3. Fill in:
   - **Name**: `annadaan`
   - **Region**: Choose any (e.g., Oregon, Ohio, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Plan**: `Free`
4. Under **Environment Variables**:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(click "Generate")*
   - `PORT`: `10000`
5. Click **"Create Web Service"**.

---

## 📄 Option 3: Separate Frontend Static Site (If Creating Manually)

If you create a **Static Site** separately in the Render UI:
- **Root Directory**: `frontend`
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
  *(⚠️ Note: Do NOT use `yarn build` - use `npm install && npm run build`)*
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://<your-annadaan-api>.onrender.com/api`
- Under **Redirects/Rewrites**:
  - Add Rule: `/*` $\rightarrow$ `/index.html` (Action: `Rewrite`)

---

## 🔍 Verification Endpoints

Once deployed:
- **API Health Check**: `https://<your-render-url>/api/health`
- **Analytics Summary**: `https://<your-render-url>/api/stats/summary`
- **Live Platform UI**: `https://<your-render-url>/`

