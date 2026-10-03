import os
import json
from google import genai

def generate_quiz(passage: str):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return [{
            "question": "Gemini is not configured. What should you add to .env?",
            "options": ["GEMINI_API_KEY", "PORT", "USERNAME", "DATABASE"],
            "answer": 0,
            "explanation": "The application uses GEMINI_API_KEY for Gemini access."
        }]

    client = genai.Client(api_key=key)
    prompt = f"""Create exactly 3 multiple-choice questions from the passage below.
Each question must contain exactly 4 options.
Return ONLY valid JSON as an array in this exact structure:
[
  {{"question":"...", "options":["A","B","C","D"], "answer":0, "explanation":"..."}}
]
The answer field must be the zero-based index of the correct option.

Passage:
{passage}"""

    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        contents=prompt
    )
    cleaned = response.text.replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)
