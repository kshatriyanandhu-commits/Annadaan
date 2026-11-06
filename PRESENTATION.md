# 📊 Annadaan - Project Presentation (Slide Deck)

> **File Download**: [Annadaan_Project_Presentation.pptx](./Annadaan_Project_Presentation.pptx)  
> **Topic**: Annadaan - Smart Waste Food Management & Rescue Donation Platform  
> **Format**: 16:9 Widescreen Presentation (10 Slides)

---

## 📑 Slide Summary & Outline

### Slide 1: Project Title and Team Details
- **Platform Title**: Annadaan - Smart Waste Food Management & Donation Platform
- **Subtitle**: A Full-Stack MERN Platform with Interactive 3D Visualizations & Concurrency Control
- **Project Lead / Architect**: Nandhu
- **Email**: kshatriyanandhu@gmail.com
- **Repository**: [https://github.com/kshatriyanandhu-commits/Annadaan](https://github.com/kshatriyanandhu-commits/Annadaan)
- **Tech Stack**: MongoDB • Express.js • React 18 • Node.js • Vite • Tailwind CSS

---

### Slide 2: Introduction and Problem Statement
- **The Food Crisis Paradox**:
  - Over 40% of catered food in urban banquet halls, weddings, and restaurants goes directly to landfills untouched.
  - Millions of underserved citizens, orphanages, and homeless shelters face daily nutritional deficits in the same cities.
  - Decomposing food in open dump sites generates 8–10% of global greenhouse gases, driving rapid climate change.
- **Logistical & Systemic Barriers**:
  - Cooked surplus food deteriorates in 6 to 12 hours; traditional charities lack real-time matching.
  - Donors rely on ad-hoc phone calls or unverified social media posts with zero tracking.
  - Restaurants fear safety liabilities without verified NGO profiles and logged handovers.
- **The Annadaan Solution**:
  - Real-time hyperlocal matching with live countdown decay timers.
  - Concurrency-safe atomic database claiming preventing duplicate pickups.
  - Transparent ESG environmental impact tracking (meals rescued, CO₂ avoided).

---

### Slide 3: Project Objectives
1. **Rapid Surplus Onboarding**: Enable commercial food generators to broadcast excess food in under 60 seconds with photos, quantity, and safe-consumption deadlines.
2. **Concurrency-Safe Claiming**: Atomic database operations guaranteeing listings cannot be double-claimed by competing shelters.
3. **Dynamic Freshness Decay**: Automated time-decay calculations showing real-time consumption windows before food degrades.
4. **Verified NGO Accountability**: Strict Role-Based Access Control (RBAC) ensuring only validated humanitarian organizations receive pickup addresses.
5. **Turn-by-Turn Logistics**: 1-Click Google Maps navigation and direct telephone links for instant ground coordination.
6. **Quantified ESG Impact**: Live tracking of meals rescued, kilograms of CO₂ diverted, and progress toward UN SDG 2 (Zero Hunger).

---

### Slide 4: Technologies and Tools Used (MERN Stack)
- **Database Tier**: MongoDB & Mongoose ODM (document schemas, aggregation pipelines, auto-failover in-memory store).
- **Backend API Tier**: Express.js & Node.js (modular routing, JWT stateless auth, Bcrypt 10 salt rounds, atomic `findOneAndUpdate`).
- **Frontend Presentation**: React 18 & Vite (Context API auth state, sub-second HMR bundler, Tailwind CSS dark-mode styling).
- **3D Graphics & DevOps**: HTML5 Canvas 3D Fibonacci sphere, 3D card tilt physics with specular shine, Git/GitHub, Render Cloud.

---

### Slide 5: System Architecture and Workflow
- **Architecture Layers**:
  - Client Tier: React 18 SPA consuming RESTful endpoints via Axios interceptors.
  - Security & Gateway Layer: CORS whitelist, Bearer JWT validation, and RBAC middleware (`donor`, `ngo`, `admin`).
  - Controller & Business Logic: `DonationController`, `AuthController`, and `StatsController`.
  - Data Persistence: MongoDB Atlas cluster with auto-failover in-memory store.
- **5-Stage Food Rescue Lifecycle**:
  1. *Listing*: Donor submits surplus details $\rightarrow$ marked `Available`.
  2. *Broadcasting*: Real-time feed alerts NGOs with countdown timer.
  3. *Claiming*: NGO claims item $\rightarrow$ status atomically shifts to `Claimed`.
  4. *Pickup*: Volunteer navigates via Google Maps $\rightarrow$ coordinates phone handover.
  5. *Handover*: Confirmation marked `Completed` $\rightarrow$ impact metrics updated.

---

### Slide 6: Features and Functionalities
- **Donor Command Center**: Modal listing form, culinary photo preset selector, active listing overview, and handover confirmation.
- **NGO Live Feed**: Real-time food feed, dietary filters (Veg, Non-Veg, Groceries), countdown freshness badges, and 1-click atomic claiming.
- **Environmental Impact Hub**: Live rescued meals counter, ESG carbon diversion metrics, category progress bars, and UN SDG alignment.
- **Security & UI Enhancements**: Strict RBAC protection, Fibonacci 3D Earth sphere, 3D card perspective tilt, floating toast alert system.

---

### Slide 7: Database Design and API Integration
- **Mongoose Document Schemas**:
  - `User`: name, email (unique index), password (bcrypt hashed), role (`donor`, `ngo`, `admin`), phone, organization, address, city.
  - `FoodDonation`: donor (ref User), title, foodType, quantity, cookedTime, expiryHours, pickupAddress, city, status (`Available`, `Claimed`, `Completed`, `Cancelled`), claimedBy, timestamps.
- **RESTful Endpoints**:
  - `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
  - `GET /api/donations`, `POST /api/donations`, `GET /api/donations/my-donations`, `GET /api/donations/my-claims`
  - `PATCH /api/donations/:id/claim`, `PATCH /api/donations/:id/complete`
  - `GET /api/stats/summary` (MongoDB Aggregation Pipelines)

---

### Slide 8: Screenshots and UI Previews
1. **Landing Hero & 3D Earth Sphere**: Interactive Fibonacci sphere with pulsing green rescue nodes, floating live stat badges, and instant CTAs.
2. **Live NGO Donation Feed**: Responsive grid of surplus food cards with cover photos, dietary chips, fresh countdown timers, and 1-click claim buttons.
3. **Donor Management Dashboard**: Modal listing creator, dynamic overview table, cancellation protection, and handover triggers.
4. **Impact & Analytics Dashboard**: Live impact counters (Meals Rescued, CO₂ Diverted), animated 3D rescue network mesh, and category breakdown bars.

---

### Slide 9: Challenges Faced and Future Scope
- **Technical Challenges Solved**:
  - Concurrency in Food Claiming $\rightarrow$ Solved via atomic `findOneAndUpdate` operations.
  - Zero-Dependency Cloud Resilience $\rightarrow$ Built-in in-memory fallback store when MongoDB is disconnected.
  - Cloud Production Build Optimization $\rightarrow$ Restructured build tools to production dependencies with locked npm scripts.
- **Future Innovation Scope**:
  - AI Food Freshness & Quality Vision (computer vision spoilage estimation).
  - Turn-by-Turn Volunteer Driver Dispatch (Uber-like automated courier assignment).
  - IoT Cold-Chain Storage Monitoring (BLE temperature loggers for perishable transit).
  - Multi-City Municipal Disaster Relief APIs.

---

### Slide 10: Conclusion
- **Transforming Food Waste into Nourishment**: Turning commercial waste liabilities into community resources.
- **Technological Excellence**: Production-ready MERN platform with 14/14 automated tests passing.
- **Measurable ESG Impact**: Direct contribution to UN Sustainable Development Goals (Zero Hunger & Responsible Consumption).
- **Links**:
  - GitHub: [https://github.com/kshatriyanandhu-commits/Annadaan](https://github.com/kshatriyanandhu-commits/Annadaan)
  - Deployment: Pre-configured for 1-Click Render Cloud Hosting.
