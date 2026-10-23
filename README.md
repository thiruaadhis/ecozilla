# 🌿 EcoZilla — AI Deforestation Detection

EcoZilla is an AI-powered satellite analysis platform that detects deforestation, canopy loss, and carbon credit impact in real time using Sentinel-2 imagery from Google Earth Engine.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TailwindCSS, Clerk auth, Leaflet maps |
| **Backend** | FastAPI, Python 3.11, PyTorch (U-Net), OpenCV, Google Earth Engine |
| **Deployment** | Vercel (frontend) · Render (backend) |

---

## Features

- 🛰️ **Live Satellite Imagery** — Sentinel-2 cloud-filtered scenes via Google Earth Engine
- 🤖 **AI Segmentation** — Custom U-Net model for land cover classification
- 📊 **Deforestation Delta** — Before/after vegetation index comparison with red overlay
- 🌡️ **Spectral Analysis** — False Color IR (CIR) + NDVI views
- 📅 **4D Timeline** — Historical canopy regression from 2020 to present
- 💰 **Carbon Credit Loss** — IPCC-standard CO₂ and VCM credit impact estimates
- 📄 **PDF Audit Export** — Downloadable site audit reports

---

## Local Development

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
earthengine authenticate      # one-time, uses your Google account
uvicorn api:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
# copy .env.local and fill in your Clerk keys
npm run dev
```

### Environment Variables

**`frontend/.env.local`**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

**`backend/.env`** (only needed locally if not using `earthengine authenticate`)
```env
GEE_PROJECT=ecozilla-511204
# GEE_SERVICE_ACCOUNT_JSON=  # set this in production (Render)
```

---

## Deployment

See [deployment guide](./render.yaml) — backend on **Render** (free), frontend on **Vercel** (free).

| Service | Env Var to set |
|---------|---------------|
| Render  | `GEE_SERVICE_ACCOUNT_JSON` (full JSON key), `GEE_PROJECT` |
| Vercel  | All Clerk keys + `NEXT_PUBLIC_BACKEND_URL` = your Render URL |

---

## Model

The U-Net model (`backend/model/weights/ecozilla_v6_gpu.pth`) is a custom semantic segmentation network trained on Sentinel-2 RGB patches for vegetation/non-vegetation classification.