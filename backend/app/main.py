"""FastAPI main application for ScholarAI backend"""
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List

from app.config import settings
from app.models.schemas import (
    TemplateFormat,
    DetectionRequest,
    DetectionResult,
    DisclosureRequest,
    DisclosureResponse,
    BrainstormRequest,
    BrainstormResponse,
    WritingImproveRequest,
    WritingImproveResponse,
    SectionGenerateRequest,
    SectionGenerateResponse,
    ChatRequest,
    ChatResponse,
    ExportRequest,
    HealthResponse
)
from app.services.template_service import template_service
from app.services.docx_service import docx_service
from app.services.detector_service import detector_service
from app.services.brainstorm_service import brainstorm_service
from app.services.llm_service import llm_service


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Ethical AI-powered research writing assistant for academic journal paper publication"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version=settings.app_version
    )


@app.get("/api/templates", response_model=List[TemplateFormat])
async def get_templates():
    """Get all available journal templates"""
    try:
        return template_service.get_all_templates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/templates/{format_name}", response_model=TemplateFormat)
async def get_template(format_name: str):
    """Get specific template by format name"""
    try:
        return template_service.get_template(format_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/detect", response_model=DetectionResult)
async def detect_ai_content(request: DetectionRequest):
    """
    Analyze text for AI-generated content
    
    ETHICAL PURPOSE: For transparency and proper disclosure, NOT evasion
    """
    try:
        return detector_service.detect(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-disclosure", response_model=DisclosureResponse)
async def generate_disclosure(request: DisclosureRequest):
    """Generate AI disclosure statement for journal submission"""
    try:
        disclosure = detector_service.generate_disclosure(
            request.ai_tools_used,
            request.purpose
        )
        return DisclosureResponse(disclosure_statement=disclosure)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/brainstorm", response_model=BrainstormResponse)
async def brainstorm_paper(request: BrainstormRequest):
    """Generate paper outline based on topic and research type"""
    try:
        result = brainstorm_service.generate_outline(
            request.topic,
            request.research_type,
            request.field
        )
        return BrainstormResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/writing/improve", response_model=WritingImproveResponse)
async def improve_writing(request: WritingImproveRequest):
    """Improve text with specified action"""
    try:
        improved_text = await llm_service.improve_text(
            request.text,
            request.action
        )
        return WritingImproveResponse(improved_text=improved_text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/writing/generate-section", response_model=SectionGenerateResponse)
async def generate_section(request: SectionGenerateRequest):
    """Generate content for a paper section"""
    try:
        content = await llm_service.generate_section(
            request.section_name,
            request.context,
            request.key_points
        )
        return SectionGenerateResponse(content=content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """Chat with AI writing assistant"""
    try:
        response = await llm_service.chat(
            request.message,
            request.context
        )
        return ChatResponse(response=response)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export/docx")
async def export_to_docx(request: ExportRequest):
    """Export paper to DOCX format"""
    try:
        # Create document
        doc_stream = docx_service.create_document(
            title=request.title,
            authors=request.authors,
            abstract=request.abstract,
            keywords=request.keywords,
            sections=request.sections,
            template_format=request.template_format,
            ai_disclosure=request.ai_disclosure
        )
        
        # Return as streaming response
        return StreamingResponse(
            doc_stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename=paper.docx"
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
