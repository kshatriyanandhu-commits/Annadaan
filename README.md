# Annadaan - Smart Waste Food Management & Donation Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node-emerald)](https://github.com/)
[![Interactive 3D UI](https://img.shields.io/badge/3D%20UI-HTML5%20Canvas%20%7C%203D%20Tilt-teal)](https://github.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Annadaan** is a full-stack, production-ready MERN platform that bridges the gap between commercial surplus food generators (banquet halls, caterers, restaurants, and households) and verified local NGOs, shelters, and community kitchens in real time.

Built to address urban hunger and food wastage, the platform features **interactive 3D planetary and network visualizations**, **3D card tilt physics with specular reflection**, automated freshness decay countdown timers, atomic food claiming protocols, and live transparent impact metrics tracking carbon and water conservation.

---

## 🎨 3D Elements & UI Visual Enhancements

### 1. Interactive 3D Earth Particle Sphere (`EarthRescueCanvas3D.jsx`)
- Rendered on the landing page hero section using an algorithmic **Fibonacci 3D sphere distribution**.
- Features pulsing green and teal rescue beacons, orbital telemetry rings, and **real-time mouse-reactive 3D parallax physics**.
- Accompanied by floating holographic 3D KPI badges with live metrics.

### 2. 3D Card Tilt & Specular Reflection (`Card3DTilt.jsx`)
- Interactive cards tilt in 3D perspective space based on cursor coordinates (`perspective(1000px) rotateX(...) rotateY(...) scale3d(1.02)`).
- Dynamic specular radial glare simulates real physical lighting reflection over food cards and category spotlights.

### 3. Live 3D Regional Rescue Network Mesh (`RescueNetwork3D.jsx`)
- Interactive 3D spatial field on the **Impact & Analytics** dashboard visualizing commercial donors (emerald nodes), shelter kitchens (teal nodes), and in-transit rescue packets (amber nodes) interconnected with pulsing line conduits.

### 4. Food Category Visual Spotlights & Preset Photo Selector
- High-resolution curated culinary photography for all categories:
  - **Vegetarian Meals (`Veg`)**: Gourmet paneer specialties, dal, curries, and steamed rice.
  - **Artisan Bakery (`Baked`)**: Dinner rolls, croissants, and wholesome bread loaves.
  - **Raw Groceries & Staples (`Raw/Grocery`)**: Sealed grains, lentils, pulses, and pantry sacks.
  - **Savory & Protein (`Non-Veg`)**: Thermal-contained roast delicacies and biryanis.
- **Donor Cover Photo Selector**: When creating a listing, donors can either pick from a 1-click grid of appetizing photo presets or paste a direct image URL with live thumbnail previews.

### 5. Immersive Food Detail Modal (`FoodDetailModal.jsx`)
- Clicking any food card opens an immersive modal featuring:
  - Full-width hero image with safe consumption window and category badges.
  - Preparation and allergen guidelines.
  - Pickup coordinates with one-click **"Open in Google Maps"** navigation.
  - Verified donor contact profile with direct telephone link (`tel:`).
  - 1-click **"Claim This Food for Shelter"** action for NGOs.

### 6. Modern Floating Toast Notification System (`Toast.jsx`)
- Sleek animated floating alerts with shrink-timer bars, dismiss animations, and status indicators (Success, Warning, Error, Info).

---

## 🏗️ Architecture & Monorepo Structure

```
food-waste-platform/
├── backend/
│   ├── config/
│   │   ├── db.js                  # Mongoose MongoDB connection & auto-resilience
│   │   └── memoryStore.js         # Zero-dependency in-memory store for instant offline testing
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Current User profile
│   │   ├── donationController.js  # CRUD, Feed queries, Atomic claim, Handover
│   │   └── statsController.js     # MongoDB Aggregation Pipeline for impact stats
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & Role-based Access Control
│   │   └── errorMiddleware.js     # Global 404 & Centralized error formatter
│   ├── models/
│   │   ├── User.js                # Schema with bcrypt hashing (10 salt rounds)
│   │   └── FoodDonation.js        # Schema with virtuals (expiresAt, isExpired) & imageUrl
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── donationRoutes.js      # /api/donations routes
│   │   └── statsRoutes.js         # /api/stats routes
│   ├── seeder.js                  # Database seeder with realistic test data
│   ├── test-suite.js              # Automated 14-point backend test runner
│   ├── .env.example               # Backend environment templates
│   ├── package.json               # Backend dependencies & run scripts
│   └── server.js                  # Express application entrypoint & CORS config
├── frontend/
│   ├── public/
│   │   └── favicon.svg            # Annadaan brand icon
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Axios client with JWT interceptor & API helpers
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Dynamic responsive navigation & role badge
│   │   │   ├── FoodCard.jsx       # 3D tilt card with image, countdown timer & actions
│   │   │   ├── FoodDetailModal.jsx# Immersive detail modal with image & Google Maps link
│   │   │   ├── Card3DTilt.jsx     # Interactive 3D tilt component with specular glare
│   │   │   ├── EarthRescueCanvas3D.jsx # 3D particle sphere with orbital beacons
│   │   │   ├── RescueNetwork3D.jsx# 3D interactive holographic mesh network visualizer
│   │   │   ├── Toast.jsx          # Animated floating notification manager
│   │   │   ├── ProtectedRoute.jsx # Role-based route guard
│   │   │   └── StatBadge.jsx      # Glassmorphic KPI counter badge
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # React Auth context with localStorage persistence
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing hero with 3D Canvas & category spotlights
│   │   │   ├── Login.jsx          # Auth login with demo credentials switch
│   │   │   ├── Register.jsx       # Multi-role registration (Donor / NGO)
│   │   │   ├── DonorDashboard.jsx # Manage food listings, photo preset picker & modal
│   │   │   ├── NGODashboard.jsx   # Live food feed, search/city filter & pickup claims
│   │   │   └── AnalyticsDashboard.jsx # 3D network visualizer & environmental metrics
│   │   ├── App.jsx                # React router configuration
│   │   ├── index.css              # Tailwind directives & 3D keyframe animations
│   │   └── main.jsx               # React entrypoint
│   ├── index.html                 # HTML template with Inter font & dark theme
│   ├── tailwind.config.js         # Custom emerald/teal sustainability palette
│   ├── postcss.config.js          # PostCSS configuration
│   ├── vite.config.js             # Vite configuration with port 5173
│   ├── .env.example               # Frontend environment template
│   └── package.json               # Frontend dependencies & Vite scripts
└── README.md
```

---

## ⚡ Automated Verification & Test Results

The backend includes a comprehensive test suite ([`test-suite.js`](file:///c:/Users/Nandhu/OneDrive/Desktop/New%20folder/food-waste-platform/backend/test-suite.js)) covering all API routes, authorization boundaries, atomic claims, and status transitions:

```text
Testing System & Health Endpoints:
  ✓ [PASS] GET / returns 200 online

Testing Analytics & Stats Endpoints:
  ✓ [PASS] GET /api/stats/summary returns aggregated metrics

Testing Authentication Endpoints:
  ✓ [PASS] POST /api/auth/login authenticates donor successfully
  ✓ [PASS] POST /api/auth/login authenticates NGO successfully
  ✓ [PASS] GET /api/auth/me returns current user
  ✓ [PASS] POST /api/auth/register registers new user with token

Testing Donation Flow & Operations:
  ✓ [PASS] GET /api/donations returns donation list
  ✓ [PASS] GET /api/donations?city=tenali&foodType=Veg filters correctly
  ✓ [PASS] POST /api/donations creates new listing (Donor only)
  ✓ [PASS] GET /api/donations/my-donations includes the created listing
  ✓ [PASS] GET /api/donations/:id returns item
  ✓ [PASS] PATCH /api/donations/:id/claim atomically claims food for NGO
  ✓ [PASS] GET /api/donations/my-claims includes the claimed listing
  ✓ [PASS] PATCH /api/donations/:id/complete marks food rescue verified and completed

===========================================
[TEST SUMMARY]: 14 PASSED, 0 FAILED
===========================================
```

---

## 🚀 Getting Started

### Step 1: Start the Backend Server
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

> **Dual Storage Resilience**: If MongoDB is active, the backend connects to MongoDB; if MongoDB is not running locally, the backend automatically enables an in-memory storage engine seeded with pre-loaded donors, NGOs, and food packages, ensuring 100% functionality with zero setup friction!

### Step 2: Seed Sample Data (When Using Real MongoDB)
```bash
cd backend
npm run seed
```

> **Demo Test Accounts**:
> - **Donor Account**: `donor@annadaan.org` / `password123`
> - **NGO Account**: `ngo@shelter.org` / `password123`
> - **Admin Account**: `admin@annadaan.org` / `password123`

### Step 3: Start the Frontend Application
```bash
cd frontend
npm run dev
# Frontend running at http://localhost:5173
```

### Step 4: Run the Backend Test Suite
```bash
cd backend
node test-suite.js
```

---

## ☁️ Deployment on Render

Annadaan is pre-configured for 1-click deployment on [Render](https://render.com) using [`render.yaml`](./render.yaml).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/kshatriyanandhu-commits/Annadaan)

### 1-Click Blueprint Deployment:
1. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
2. Connect your repository: `https://github.com/kshatriyanandhu-commits/Annadaan`.
3. Render automatically provisions the `annadaan-api` Web Service and `annadaan-web` Static Site!

For complete step-by-step instructions (including single free-tier Web Service setup), see the detailed [Render Deployment Guide](./RENDER_DEPLOYMENT.md).

---

## 📜 License
This project is licensed under the ISC License.
