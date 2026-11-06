# 🚀 Render Deployment Guide for Annadaan

This repository is pre-configured for seamless, zero-friction deployment on **[Render](https://render.com)**.

You have **two options** to deploy Annadaan on Render:
- **Option 1 (Recommended): 1-Click Render Blueprint** (Automates both Backend & Frontend)
- **Option 2: Unified Web Service** (Runs fullstack app on a single free Render Web Service)

---

## ⚡ Option 1: 1-Click Render Blueprint (Recommended)

Render Blueprints read the included [`render.yaml`](./render.yaml) and automatically configure:
1. `annadaan-api`: Node.js Express REST API Web Service
2. `annadaan-web`: React 18 + Vite Static Site hosted on global CDN

### Steps:
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **"New +"** in the top navigation and select **"Blueprint"**.
3. Connect your GitHub repository:
   ```
   https://github.com/kshatriyanandhu-commits/Annadaan
   ```
4. Render will detect `render.yaml` automatically and display the two services:
   - **Backend Web Service (`annadaan-api`)**
   - **Frontend Static Site (`annadaan-web`)**
5. (Optional) In `annadaan-api` settings, add your `MONGO_URI` if you want to connect a MongoDB Atlas cluster. If left blank, Annadaan's built-in resilient in-memory store will automatically handle all data.
6. Click **"Apply"**.
7. Render will build and deploy both services!

---

## 🌐 Option 2: Single Unified Web Service (Free Tier All-in-One)

Render allows running the Node backend and serving the built React frontend from a single web service. This requires only 1 free-tier instance.

### Steps:
1. In Render Dashboard, click **"New +"** and choose **"Web Service"**.
2. Select your repository: `https://github.com/kshatriyanandhu-commits/Annadaan`.
3. Set the configuration:
   - **Name**: `annadaan`
   - **Region**: Choose the closest region (e.g., Oregon, Ohio, Frankfurt, Singapore)
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
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(click Generate or enter a secure random string)*
   - `PORT`: `10000`
   - `MONGO_URI`: *(Optional: MongoDB Atlas connection string)*
5. Click **"Create Web Service"**.
6. Render will automatically build the frontend, compile the production assets, start the Express backend, and provide your live URL (e.g., `https://annadaan.onrender.com`).

---

## 🔍 Verification Endpoints

Once deployed, you can verify your service status:
- **API Health Check**: `https://<your-render-url>/api/health`
- **Analytics Summary**: `https://<your-render-url>/api/stats/summary`
- **Live Platform UI**: `https://<your-render-url>/`
