from main import resume, profile, portfolio
from prompt import SYSTEM_PROMPT
from llm import get_response
from memory import memory


def generate(chat_id, question):

    if chat_id not in memory:

        memory[chat_id] = []

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "system",
            "content":
                f"""
Resume:

{resume}

Profile:

{profile}

Portfolio:

{portfolio}
"""
        }
    ]

    messages.extend(memory[chat_id])

    messages.append(
        {
            "role": "user",
            "content": question
        }
    )

    stream = get_response(messages)

    answer = ""

    for chunk in stream:

        text = chunk.choices[0].delta.content

        if text:

            answer += text

            yield text

    memory[chat_id].append(
        {
            "role": "user",
            "content": question
        }
    )

    memory[chat_id].append(
        {
            "role": "assistant",
            "content": answer
        }
    )