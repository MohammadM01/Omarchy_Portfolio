import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found")

client = Groq(
    api_key=api_key
)

MODEL = "llama-3.3-70b-versatile"


def get_response(messages):

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        stream=True
    )

    return response