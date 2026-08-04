import uuid
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from chat import generate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():

    return {
        "message": "AI Portfolio Backend is Running"
    }


@app.get("/new-chat")
def new_chat():

    return {
        "chat_id": str(uuid.uuid4())
    }


@app.get("/chat")
def chat(question: str, chat_id: Optional[str] = None):
    if not chat_id:
        chat_id = str(uuid.uuid4())
    return StreamingResponse(
        generate(chat_id, question),
        media_type="text/plain"
    )