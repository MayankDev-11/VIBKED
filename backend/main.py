from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.rag import answer_question

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str
    mode: str = "document"


@app.get("/")
def root():
    return {"message": "VIBKED API is running"}


@app.post("/chat")
def chat(request: ChatRequest):
    answer, sources = answer_question(
        question=request.question,
        mode=request.mode,
    )

    return {
        "answer": answer,
        "sources": sources,
    }


@app.get("/documents/{filename:path}")
def get_document(filename: str):
    file_path = Path("data") / filename

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return FileResponse(
        path=file_path,
        filename=file_path.name,
    )
