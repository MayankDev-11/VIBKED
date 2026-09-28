from fastapi import FastAPI
from pydantic import BaseModel

from backend.rag import answer_question

app = FastAPI()


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
