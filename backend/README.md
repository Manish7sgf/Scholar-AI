# ScholarAI Backend

FastAPI-based backend for ScholarAI - an ethical AI-powered research writing assistant.

## Features

- **Template Service**: Support for multiple journal formats (IEEE, Springer, Elsevier, ACM, APA 7th, MLA 9th)
- **DOCX Export**: Export papers to properly formatted Word documents
- **AI Detector**: Analyze text for AI content (for transparency, not evasion)
- **Brainstorm Service**: Generate paper outlines based on topic and research type
- **LLM Integration**: OpenAI-powered writing assistance and improvements
- **RESTful API**: Clean, documented API endpoints

## Prerequisites

- Python 3.11+
- OpenAI API key (optional, for LLM features)

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

## Running the Server

### Development
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker
```bash
docker build -t scholarai-backend .
docker run -p 8000:8000 --env-file .env scholarai-backend
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Templates
- `GET /api/templates` - List all journal templates
- `GET /api/templates/{format_name}` - Get specific template

### AI Detection
- `POST /api/detect` - Analyze text for AI content
- `POST /api/generate-disclosure` - Generate AI disclosure statement

### Brainstorming
- `POST /api/brainstorm` - Generate paper outline

### Writing Assistance
- `POST /api/writing/improve` - Improve text (clarity, formality, etc.)
- `POST /api/writing/generate-section` - Generate section content
- `POST /api/chat` - Chat with AI assistant

### Export
- `POST /api/export/docx` - Export paper to DOCX

### Health
- `GET /health` - Health check

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic models
│   └── services/
│       ├── __init__.py
│       ├── template_service.py    # Journal templates
│       ├── docx_service.py        # DOCX export
│       ├── detector_service.py    # AI detection
│       ├── brainstorm_service.py  # Outline generation
│       └── llm_service.py         # OpenAI integration
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md
```

## Environment Variables

- `OPENAI_API_KEY` - OpenAI API key (required for LLM features)
- `OPENAI_MODEL` - OpenAI model to use (default: gpt-4-turbo-preview)
- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `APP_NAME` - Application name (default: ScholarAI)
- `APP_VERSION` - Application version (default: 1.0.0)
- `DEBUG` - Debug mode (default: False)

## Ethical Usage

This tool is designed for **ethical academic writing assistance**:
- The AI detector is for **transparency**, not evasion
- Always disclose AI usage in journal submissions
- Use AI as a writing aid, not a replacement for original research
- Maintain academic integrity at all times

## License

MIT License - See LICENSE file for details
