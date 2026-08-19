"""
LexAI Public API
================

Public-facing API interface for the LexAI legal assistant.

This repository intentionally does NOT contain:
- Private model pipeline implementation
- Knowledge-base files
- FAISS index
- Embeddings
- Private prompts
- Model credentials/API keys
- ngrok authentication tokens
- Private Kaggle paths
- Internal validation implementation

The private inference pipeline is represented by the LexAIEngine
interface below and should remain on the server.

Public API:
    GET  /
    GET  /api/health
    POST /api/ask

Expected POST body:
    {"query": "your legal question"}

Expected response:
    {
        "answer": "...",
        "validation_status": "SUPPORTED | REVIEW_REQUIRED | REJECTED",
        "sources": ["DOC..."],
        "timing": {
            "retrieval": 0.0,
            "reranking": 0.0,
            "generation": 0.0,
            "total": 0.0
        }
    }
"""

import os
import time
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

APP_NAME = "LexAI API"
APP_VERSION = "1.0.0"

# Keep private infrastructure outside this public file.
# Example:
#   LEXAI_API_URL=https://your-private-server.example
#
# This value is intentionally not required by this API implementation.
LEXAI_ENV = os.getenv("LEXAI_ENV", "production")


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------

class AskRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Legal question")


class AskResponse(BaseModel):
    answer: str
    validation_status: str
    sources: list[str]
    timing: dict[str, float]


# ---------------------------------------------------------------------------
# Private inference boundary
# ---------------------------------------------------------------------------

class LexAIEngine:
    """
    Public interface to the private LexAI inference pipeline.

    The real implementation stays outside this repository.

    Internally, the private system may perform:
        query processing
        retrieval
        reranking
        generation
        claim validation
        source attribution

    Do not place the private implementation in this public file.
    """

    def ask(self, query: str) -> dict[str, Any]:
        """
        Replace this method on the private server with the real
        LexAI inference implementation.

        This public repository intentionally does not contain
        the proprietary inference code or knowledge base.
        """
        raise NotImplementedError(
            "Private LexAI inference implementation is not included "
            "in the public repository."
        )


# The private deployment injects the real engine implementation.
lexai = LexAIEngine()


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title=APP_NAME,
    description="Public API interface for the LexAI legal information assistant.",
    version=APP_VERSION,
)


@app.get("/")
def root():
    return {
        "name": APP_NAME,
        "status": "online",
        "version": APP_VERSION,
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "model": "LexAI",
        "engine_loaded": True,
    }


@app.post("/api/ask", response_model=AskResponse)
def ask(request: AskRequest):
    query = request.query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty.",
        )

    try:
        start = time.perf_counter()

        result = lexai.ask(query)

        elapsed = time.perf_counter() - start

        # Keep the public response contract stable.
        return {
            "answer": result.get("answer", ""),
            "validation_status": result.get(
                "validation_status",
                "REVIEW_REQUIRED",
            ),
            "sources": result.get("sources", []),
            "timing": result.get(
                "timing",
                {
                    "retrieval": 0.0,
                    "reranking": 0.0,
                    "generation": elapsed,
                    "total": elapsed,
                },
            ),
        }

    except NotImplementedError:
        raise HTTPException(
            status_code=501,
            detail="Private LexAI inference engine is not included in this public repository.",
        )

    except Exception:
        # Never expose internal stack traces, model errors,
        # file paths, credentials, or implementation details.
        raise HTTPException(
            status_code=500,
            detail="LexAI could not process the request.",
        )


# ---------------------------------------------------------------------------
# Local development
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
    )
