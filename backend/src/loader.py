import json

from pypdf import PdfReader


def load_resume(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text + "\n"

    return text


def load_json(file_path):

    with open(file_path, "r", encoding="utf-8") as file:

        return json.load(file)