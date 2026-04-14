import os
import asyncio
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from formula import get_playoff_teams, run_formula

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="NBA Champion Predictor API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — allow the Vite dev server and the deployed frontend URL
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Thread pool for running synchronous NBA API calls without blocking the event loop
_executor = ThreadPoolExecutor(max_workers=2)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/teams")
@limiter.limit("30/minute")
async def teams(request: Request):
    """Returns the 20 playoff/play-in teams. Fast — only calls leaguestandings."""
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(_executor, get_playoff_teams)
        return JSONResponse(content={"teams": result})
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})


@app.get("/predict")
@limiter.limit("5/minute")
async def predict(request: Request):
    """
    Runs all 5 requirements and returns the full step-by-step prediction.
    First call takes 10-30s (live NBA API). Subsequent calls return instantly from cache.
    """
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(_executor, run_formula)
        return JSONResponse(content=result)
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})
