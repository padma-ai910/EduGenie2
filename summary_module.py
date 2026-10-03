import os
from google import genai

def summarize_text(text: str):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return "Gemini API is not configured. Add GEMINI_API_KEY to your .env file."

    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
        contents=f"""Summarize the following educational passage for quick revision.
Keep important facts, definitions, and relationships.
Use concise bullet points.

Passage:
{text}"""
    )
    return response.text
