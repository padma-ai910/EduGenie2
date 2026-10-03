import os
from google import genai

def _client():
    key = os.getenv("GEMINI_API_KEY")
    return genai.Client(api_key=key) if key else None

def explain_topic(topic: str, level: str = "standard"):
    client = _client()
    if not client:
        return (
            "Gemini API is not configured. Add GEMINI_API_KEY to your .env file.\n\n"
            f"Topic received: {topic}"
        )

    prompt = f"""Explain the following topic for a {level} learner.
Use these headings:
1. What it is
2. How it works
3. Simple example
4. Key points

Keep the explanation clear, concise, and educational.
Topic: {topic}"""

    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
        contents=prompt
    )
    return response.text
