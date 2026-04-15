# 🏀 Raiden's NBA Champion Predictor

A web app that predicts the NBA Champion using a custom 5-step elimination formula built on live NBA statistics. All 20 playoff and play-in teams are run through a series of requirements, eliminating teams one by one until a single predicted champion remains.

**Live site:** [raidenpredictsnba.com](https://raidenpredictsnba.com)

---

## How the Formula Works

Starting with the top 10 teams from each conference (20 total), the formula applies 5 requirements in sequence:

| # | Requirement | Historical Accuracy |
|---|---|---|
| 1 | Must have a Top 10 PPG scorer or Top 10 RPG rebounder | 28/30 champions (93%) |
| 2 | Must have a Top 10 MVP candidate on the roster | 29/30 champions (97%) |
| 3 | Must rank Top 10 in 3-Point % among remaining teams | 11/12 champions (92%) |
| 4 | Must rank Top 5 in Defensive Rating among remaining teams | 38/40 champions (95%) |
| 5 | Must have the best Field Goal % among remaining teams | 23/25 champions (92%) |

Each requirement eliminates non-qualifying teams. One team survives all 5 — the predicted champion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Python, FastAPI, uvicorn |
| Data | nba-api (NBA's public stats endpoints) |
| Frontend hosting | Vercel |
| Backend hosting | Render |

---

## Running Locally

**Backend**

    cd backend
    pip install -r requirements.txt
    python -m uvicorn main:app --reload

Runs on http://localhost:8000

**Frontend**

    cd frontend
    npm install
    npm run dev

Runs on http://localhost:5173

Create a `.env` file in `frontend/` for local development:

    VITE_API_URL=http://localhost:8000

---

## Deployment

| Service | Purpose |
|---|---|
| Render | Hosts the FastAPI backend |
| Vercel | Hosts the React frontend |

**Render (backend) environment variables:**

| Variable | Value |
|---|---|
| `CORS_ORIGINS` | raidenpredictsnba.com |

**Vercel (frontend) environment variables:**

| Variable | Value |
|---|---|
| `VITE_API_URL` | https://nba-champion-predictor-by-raiden.onrender.com |

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /teams` | Returns the 20 playoff/play-in teams (cached 24hr) |
| `GET /predict` | Runs the full formula and returns step-by-step results (cached 1hr) |
