# MedAssist Deployment Guide

This guide details how to deploy **MedAssist – Clinic Operations & Patient Care Portal** to production environments.

---

## 1. Cloud Database & Authentication Summary

MedAssist is pre-configured with authenticated cloud connectivity to **MongoDB Atlas**:

- **Database Engine**: MongoDB Atlas Cloud (M0 Cluster)
- **Database Name**: `medassist`
- **Configured Connection String**:
  ```env
  MONGO_URI=mongodb+srv://lokeshsadhu2007_db_user:4T952ln4GYnIIImk@cluster0.5w67tkt.mongodb.net/medassist?retryWrites=true&w=majority&appName=Cluster0
  ```
- **Seeded Clinical Accounts**:
  The database is initialized with full profiles and seeded records for all five healthcare roles:
  - **Clinic Admin**: `admin@medassist.com` / `Admin@123`
  - **Doctor (Cardiology)**: `dr.sharma@medassist.com` / `Doctor@123`
  - **Receptionist**: `reception@medassist.com` / `Reception@123`
  - **Lab Technician**: `lab@medassist.com` / `LabTech@123`
  - **Patient**: `patient.john@example.com` / `Patient@123`

> [!IMPORTANT]
> **MongoDB Atlas Network Access**:
> In your MongoDB Atlas dashboard under **Security** > **Network Access**, ensure that `0.0.0.0/0` (Allow Access from Anywhere) is active so your cloud hosting provider can connect to the database.

---

## 2. Deployment Options

### Option A: Unified Full-Stack Deploy on Render (Recommended)

In this setup, a single Node.js service builds the Vite React client and serves it directly alongside the Express API.

1. Push your code to a GitHub or GitLab repository.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** > **Blueprint**.
3. Connect your repository. Render will automatically detect [`render.yaml`](./render.yaml).
4. Alternatively, create a **Web Service** manually:
   - **Environment**: Node
   - **Build Command**:
     ```bash
     npm --prefix server install && npm --prefix client install && npm --prefix client run build
     ```
   - **Start Command**:
     ```bash
     node server/src/index.js
     ```
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render sets this automatically)
     - `MONGO_URI`: `mongodb+srv://lokeshsadhu2007_db_user:4T952ln4GYnIIImk@cluster0.5w67tkt.mongodb.net/medassist?retryWrites=true&w=majority&appName=Cluster0`
     - `JWT_SECRET`: Generate a random secure string (e.g. `openssl rand -hex 32`)
     - `JWT_EXPIRES_IN`: `7d`
     - `CLIENT_URL`: `https://<your-render-subdomain>.onrender.com`

---

### Option B: Docker / VPS Deployment (DigitalOcean, AWS EC2, Linode)

MedAssist includes a multi-stage production [`Dockerfile`](./Dockerfile) and [`docker-compose.yml`](./docker-compose.yml).

1. Install Docker and Docker Compose on your server.
2. Clone the repository and navigate into it:
   ```bash
   git clone <repo-url>
   cd MediAssit
   ```
3. Start the application:
   ```bash
   docker compose up -d --build
   ```
4. Check running status:
   ```bash
   docker compose ps
   docker compose logs -f
   ```
5. The application will be live at `http://<your-server-ip>:5000`.

---

### Option C: Decoupled Deploy (Vercel Frontend + Render Backend)

If you prefer hosting the client on Vercel's global CDN and the backend on Render/Railway:

#### 1. Backend (Render / Railway):
- Set root directory to `server` (or keep root).
- Build command: `npm install`
- Start command: `node src/index.js`
- Set `CLIENT_URL` to your Vercel domain (e.g. `https://medassist.vercel.app`).

#### 2. Frontend (Vercel):
- In Vercel, set root directory to `client`.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Add Environment Variable:
  - `VITE_API_URL`: `https://<your-backend>.onrender.com`
- [`client/vercel.json`](./client/vercel.json) handles React Router single-page application rewrites automatically.

---

## 3. Production Verification & Health Checks

- **Health Check Endpoint**:
  ```bash
  curl https://<your-deployed-domain>/api/health
  ```
  Expected Response:
  ```json
  {
    "status": "healthy",
    "system": "MedAssist Clinic Operations & Patient Care Portal",
    "database": "connected",
    "environment": "production"
  }
  ```

- **Re-seeding Test Data** (if needed):
  ```bash
  npm run seed
  ```
