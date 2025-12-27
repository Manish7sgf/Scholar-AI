"""Pydantic schemas for ScholarAI API"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class ResearchType(str, Enum):
    """Research paper types"""
    experimental = "experimental"
    review = "review"
    case_study = "case_study"
    theoretical = "theoretical"
    survey = "survey"


class AILevel(str, Enum):
    """AI detection levels"""
    low = "low"
    medium = "medium"
    high = "high"


class WritingAction(str, Enum):
    """Writing improvement actions"""
    improve_clarity = "improve_clarity"
    make_formal = "make_formal"
    simplify = "simplify"
    expand = "expand"
    summarize = "summarize"
    fix_grammar = "fix_grammar"


class TemplateFormat(BaseModel):
    """Journal template format"""
    name: str
    display_name: str
    citation_style: str
    font_family: str
    font_size: int
    line_spacing: float
    margin_top: float
    margin_bottom: float
    margin_left: float
    margin_right: float
    sections: List[str]
    word_limit: Optional[int] = None
    abstract_word_limit: Optional[int] = None


class DetectionRequest(BaseModel):
    """Request for AI detection"""
    text: str = Field(..., min_length=1)


class DetectionResult(BaseModel):
    """AI detection result"""
    score: int = Field(..., ge=0, le=100)
    level: AILevel
    flagged_sections: List[str]
    suggestions: List[str]


class DisclosureRequest(BaseModel):
    """Request for AI disclosure generation"""
    ai_tools_used: List[str]
    purpose: str


class DisclosureResponse(BaseModel):
    """AI disclosure statement"""
    disclosure_statement: str


class BrainstormRequest(BaseModel):
    """Request for paper brainstorming"""
    topic: str = Field(..., min_length=1)
    research_type: ResearchType
    field: str = Field(..., min_length=1)


class BrainstormResponse(BaseModel):
    """Brainstorm result"""
    title_suggestions: List[str]
    structure: List[Dict[str, Any]]
    key_points: List[str]
    methodology_suggestions: List[str]
    reference_topics: List[str]


class WritingImproveRequest(BaseModel):
    """Request for writing improvement"""
    text: str = Field(..., min_length=1)
    action: WritingAction


class WritingImproveResponse(BaseModel):
    """Writing improvement result"""
    improved_text: str


class SectionGenerateRequest(BaseModel):
    """Request for section generation"""
    section_name: str
    context: str
    key_points: Optional[List[str]] = None


class SectionGenerateResponse(BaseModel):
    """Section generation result"""
    content: str


class ChatRequest(BaseModel):
    """Chat request"""
    message: str = Field(..., min_length=1)
    context: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response"""
    response: str


class ExportRequest(BaseModel):
    """Export to DOCX request"""
    title: str
    authors: List[str]
    abstract: str
    keywords: List[str]
    sections: List[Dict[str, str]]
    template_format: str
    ai_disclosure: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
