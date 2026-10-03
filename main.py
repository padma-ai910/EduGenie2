import os
import json
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from dotenv import load_dotenv

from explanation_module import explain_topic
from qna import answer_question
from quiz_module import generate_quiz
from summary_module import summarize_text
from learning_path import get_learning_recommendations

load_dotenv()

app = FastAPI(title="EduGenie - Google Gemini Powered Learning Assistant")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


class TaskRequest(BaseModel):
    text: str
    level: str = "standard"


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
 return templates.TemplateResponse(
    request=request,
    name="index.html"
)

@app.post("/qa")
async def qa(data: TaskRequest):
    return await run_task("qa", data)


@app.post("/explain")
async def explain(data: TaskRequest):
    return await run_task("explain", data)


@app.post("/quiz")
async def quiz(data: TaskRequest):
    return await run_task("quiz", data)


@app.post("/summarize")
async def summarize(data: TaskRequest):
    return await run_task("summarize", data)


@app.post("/learn/recommendations")
async def recommendations(data: TaskRequest):
    return await run_task("learn", data)


async def run_task(task: str, data: TaskRequest):
    if not data.text.strip():
        return JSONResponse({"error": "Please enter a topic, question, or passage."}, status_code=400)

    try:
        if task == "qa":
            result = answer_question(data.text)
        elif task == "explain":
            result = explain_topic(data.text, data.level)
        elif task == "quiz":
            result = generate_quiz(data.text)
            if isinstance(result, str):
                try:
                    result = json.loads(result)
                except json.JSONDecodeError:
                    pass
        elif task == "summarize":
            result = summarize_text(data.text)
        else:
            result = get_learning_recommendations(data.text, data.level)

        return {"result": result}
    except Exception as exc:
        return JSONResponse({"error": str(exc)}, status_code=502)


@app.get("/health")
async def health():
    return {"status": "ok", "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))}
