from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.rag import answer_question

app = FastAPI()


# Allow frontend to communicate with FastAPI
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
    answer, sources = answer_question(question=request.question, mode=request.mode)

    return {"answer": answer, "sources": sources}
