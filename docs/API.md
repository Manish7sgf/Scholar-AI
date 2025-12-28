# ScholarAI API Documentation

Complete API documentation for ScholarAI backend services.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, no authentication is required. OpenAI API key is configured server-side.

## Response Format

All API responses follow standard JSON format:
- Success: `{ data: {...} }` or direct data object
- Error: `{ detail: "error message" }`

---

## Health Check

### GET /health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## Templates

### GET /api/templates

Get all available journal templates.

**Response:**
```json
[
  {
    "name": "ieee",
    "display_name": "IEEE",
    "citation_style": "IEEE",
    "font_family": "Times New Roman",
    "font_size": 10,
    "line_spacing": 1.0,
    "margin_top": 0.75,
    "margin_bottom": 1.0,
    "margin_left": 0.75,
    "margin_right": 0.75,
    "sections": ["Abstract", "Introduction", ...],
    "word_limit": 6000,
    "abstract_word_limit": 150
  }
]
```

### GET /api/templates/{format_name}

Get specific template by format name.

**Parameters:**
- `format_name` (path): Template name (ieee, springer, elsevier, acm, apa7, mla9)

**Response:** Template object

**Errors:**
- 404: Template not found

---

## AI Detection

### POST /api/detect

Analyze text for AI-generated content patterns (for transparency, NOT evasion).

**Request:**
```json
{
  "text": "Text to analyze..."
}
```

**Response:**
```json
{
  "score": 45,
  "level": "medium",
  "flagged_sections": ["..."],
  "suggestions": ["..."]
}
```

### POST /api/generate-disclosure

Generate AI disclosure statement for journal submission.

**Request:**
```json
{
  "ai_tools_used": ["ChatGPT", "Grammarly"],
  "purpose": "improving clarity and fixing grammar"
}
```

**Response:**
```json
{
  "disclosure_statement": "AI Disclosure Statement..."
}
```

---

## Brainstorming

### POST /api/brainstorm

Generate paper outline based on topic and research type.

**Request:**
```json
{
  "topic": "Machine Learning in Healthcare",
  "research_type": "experimental",
  "field": "Computer Science"
}
```

**Response:** Includes title_suggestions, structure, key_points, methodology_suggestions, reference_topics

---

## Writing Assistance

### POST /api/writing/improve

Improve text with specified action.

**Actions:** improve_clarity, make_formal, simplify, expand, summarize, fix_grammar

### POST /api/writing/generate-section

Generate content for a paper section.

### POST /api/chat

Chat with AI writing assistant.

---

## Export

### POST /api/export/docx

Export paper to formatted DOCX document.

**Response:** Binary DOCX file download

---

For full API documentation, visit http://localhost:8000/docs when server is running.
