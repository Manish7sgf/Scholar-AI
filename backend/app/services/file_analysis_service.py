"""File analysis service for document processing"""
from typing import Dict, Any, List, Tuple
from docx import Document
from PyPDF2 import PdfReader
from io import BytesIO
from app.services.detector_service import detector_service
from app.models.schemas import DetectionResult, FileAnalysisResult


class FileAnalysisService:
    """Service for analyzing uploaded files"""
    
    def __init__(self):
        """Initialize file analysis service"""
        pass
    
    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(BytesIO(file_content))
            text_parts = []
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text_parts.append(paragraph.text)
            return "\n\n".join(text_parts)
        except Exception as e:
            raise ValueError(f"Failed to extract text from DOCX: {str(e)}")
    
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PdfReader(BytesIO(file_content))
            text_parts = []
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text.strip():
                    text_parts.append(text)
            return "\n\n".join(text_parts)
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    def extract_text_from_txt(self, file_content: bytes) -> str:
        """Extract text from TXT file"""
        try:
            return file_content.decode('utf-8')
        except UnicodeDecodeError:
            try:
                return file_content.decode('latin-1')
            except Exception as e:
                raise ValueError(f"Failed to decode text file: {str(e)}")
    
    def extract_text(self, file_content: bytes, filename: str) -> Tuple[str, str]:
        """
        Extract text from file based on extension
        
        Returns:
            Tuple of (extracted_text, detected_format)
        """
        filename_lower = filename.lower()
        
        if filename_lower.endswith('.docx'):
            return self.extract_text_from_docx(file_content), 'docx'
        elif filename_lower.endswith('.pdf'):
            return self.extract_text_from_pdf(file_content), 'pdf'
        elif filename_lower.endswith('.txt'):
            return self.extract_text_from_txt(file_content), 'txt'
        else:
            raise ValueError(f"Unsupported file format. Supported: .docx, .pdf, .txt")
    
    def analyze_structure(self, text: str) -> Dict[str, Any]:
        """Analyze document structure"""
        lines = text.split('\n')
        paragraphs = [p for p in text.split('\n\n') if p.strip()]
        
        # Count words
        words = text.split()
        word_count = len(words)
        
        # Estimate sections (simple heuristic - look for capitalized lines)
        potential_sections = []
        for line in lines:
            line_stripped = line.strip()
            if line_stripped and line_stripped.isupper() and len(line_stripped.split()) <= 5:
                potential_sections.append(line_stripped)
        
        # Calculate average sentence length
        sentences = text.replace('!', '.').replace('?', '.').split('.')
        sentences = [s.strip() for s in sentences if s.strip()]
        avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences) if sentences else 0
        
        return {
            "total_lines": len(lines),
            "total_paragraphs": len(paragraphs),
            "word_count": word_count,
            "estimated_sections": potential_sections[:10],  # Limit to 10
            "avg_sentence_length": round(avg_sentence_length, 1),
            "has_abstract": any('abstract' in line.lower() for line in lines[:20])
        }
    
    def generate_improvement_suggestions(
        self,
        structure: Dict[str, Any],
        detection_result: DetectionResult
    ) -> List[str]:
        """Generate suggestions for improving the document"""
        suggestions = []
        
        # Structure suggestions
        if structure["word_count"] < 2000:
            suggestions.append("Document is relatively short. Consider expanding key sections with more details and examples.")
        elif structure["word_count"] > 10000:
            suggestions.append("Document is quite long. Consider condensing sections to improve readability.")
        
        if structure["avg_sentence_length"] > 30:
            suggestions.append("Average sentence length is high. Consider breaking complex sentences into simpler ones.")
        elif structure["avg_sentence_length"] < 10:
            suggestions.append("Average sentence length is quite short. Consider combining related ideas for better flow.")
        
        if not structure["has_abstract"]:
            suggestions.append("No abstract detected. Add an abstract summarizing your research.")
        
        if len(structure["estimated_sections"]) < 3:
            suggestions.append("Few sections detected. Consider organizing content with clear section headings (Introduction, Methodology, Results, etc.).")
        
        # AI detection suggestions
        if detection_result.level == "high":
            suggestions.append("High AI-generated content detected. Review and add more original analysis and insights.")
        elif detection_result.level == "medium":
            suggestions.append("Moderate AI-generated content detected. Consider revising flagged sections for authenticity.")
        
        # Add formatting suggestions
        suggestions.append("Ensure proper citation format matches your target journal (IEEE, APA, etc.).")
        suggestions.append("Review figures and tables for proper numbering and captions.")
        suggestions.append("Check that all references are properly cited in the text.")
        
        return suggestions
    
    def analyze_file(self, file_content: bytes, filename: str) -> FileAnalysisResult:
        """
        Perform complete analysis of uploaded file
        
        Args:
            file_content: File bytes
            filename: Original filename
            
        Returns:
            FileAnalysisResult with complete analysis
        """
        # Extract text
        text, detected_format = self.extract_text(file_content, filename)
        
        # Analyze structure
        structure = self.analyze_structure(text)
        
        # Run AI detection
        ai_detection = detector_service.detect(text)
        
        # Generate improvement suggestions
        suggestions = self.generate_improvement_suggestions(structure, ai_detection)
        
        return FileAnalysisResult(
            word_count=structure["word_count"],
            detected_format=detected_format,
            ai_detection=ai_detection,
            structure_analysis=structure,
            improvement_suggestions=suggestions
        )


# Singleton instance
file_analysis_service = FileAnalysisService()
