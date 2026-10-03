# EduGenie — Google Gemini Powered Learning Assistant

TN Skills project based on the supplied EduGenie specification.

## Features
- Ask questions
- Explain complex concepts
- Generate exactly 3 MCQs with 4 options
- Summarize educational passages
- Generate beginner-to-advanced learning paths

## Tech Stack
FastAPI, Jinja2, HTML, CSS, JavaScript, Google Gemini API, Uvicorn.

## Run in VS Code

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your Gemini API key.

Start:

```powershell
uvicorn main:app --reload
```

Open http://127.0.0.1:8000

## GitHub
Do not commit `.env`. The `.gitignore` file protects it.

## Render deployment
Build command:
`pip install -r requirements.txt`

Start command:
`uvicorn main:app --host 0.0.0.0 --port $PORT`

Add `GEMINI_API_KEY` as a Render environment variable.
