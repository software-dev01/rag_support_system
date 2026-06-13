from fastapi import FastAPI

from app.schemas import QueryRequest
from app.rag import (
    generate_answer,
    stream_answer
)
from app.ingest import ingest_documents
from app.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

import asyncio

app = FastAPI(
    title="Support Knowledge Assistant API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Upload Routes
app.include_router(upload_router)


@app.api_route(
    "/",
    methods=["GET", "HEAD"]
)
def health():
    """
    Health Check Endpoint
    """

    return {
        "status": "healthy"
    }

import os

@app.get("/debug")
def debug():
    return {
        "status": "healthy",
        "gemini_key": bool(
            os.getenv(
                "GEMINI_API_KEY"
            )
        ),
        "mongo_uri": bool(
            os.getenv(
                "MONGO_URI"
            )
        ),
        "vector_index": os.getenv(
            "VECTOR_INDEX"
        ),
    }

@app.post("/ask")
def ask(
    request: QueryRequest
):
    """
    Ask a question against
    the knowledge base
    """

    return generate_answer(
        request.question
    )


@app.post("/stream")
async def stream(
    request: QueryRequest
):
    return StreamingResponse(
        stream_answer(
            request.question
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control":
                "no-cache",
            "Connection":
                "keep-alive",
            "X-Accel-Buffering":
                "no",
        },
    )

@app.post("/reingest")
def reingest():
    """
    Rebuild embeddings
    from all documents
    """

    ingest_documents()

    return {
        "message":
            "Documents re-ingested successfully"
    }



@app.get("/test-stream")
async def test_stream():

    async def generate():
        words = [
            "International ",
            "delivery ",
            "times ",
            "vary ",
            "by ",
            "destination ",
            "and ",
            "customs ",
            "processing."
        ]

        for word in words:
            yield word
            await asyncio.sleep(0.5)

    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )