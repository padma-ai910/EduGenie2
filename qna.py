import os
from google import genai

def answer_question(question: str):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return (
            "Gemini API is not configured. Add GEMINI_API_KEY to your .env file.\n\n"
            f"Question received: {question}"
        )

    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        contents=f"""You are EduGenie, a student-friendly educational assistant.
Answer this academic question accurately and concisely.
Use simple language and give an example when useful.

Question: {question}"""
    )
    return response.text
