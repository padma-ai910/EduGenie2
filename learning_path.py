import os
from google import genai

def get_learning_recommendations(topic: str, level: str = "standard"):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return "Gemini API is not configured. Add GEMINI_API_KEY to your .env file."

    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        contents=f"""Create a personalized learning path for {topic}.
Learner level: {level}.
Organize it from beginner to advanced.
Include prerequisites, stages, practice ideas, revision, and useful resource types.
Do not invent specific URLs."""
    )
    return response.text
