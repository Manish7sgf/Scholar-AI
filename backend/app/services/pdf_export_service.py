"""PDF export service for generating PDF documents"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from io import BytesIO
from app.services.template_service import template_service


class PdfExportService:
    """Service for exporting papers to PDF format"""
    
    def create_pdf(
        self,
        title: str,
        content: str,
        template_format: str = "ieee"
    ) -> BytesIO:
        """
        Create a PDF document with proper formatting
        
        Args:
            title: Document title
            content: Document content
            template_format: Template format name
            
        Returns:
            BytesIO: PDF document as bytes
        """
        # Get template configuration
        template = template_service.get_template(template_format)
        
        # Create PDF buffer
        buffer = BytesIO()
        
        # Create document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=template.margin_right * inch,
            leftMargin=template.margin_left * inch,
            topMargin=template.margin_top * inch,
            bottomMargin=template.margin_bottom * inch
        )
        
        # Container for flowables
        story = []
        
        # Get styles
        styles = getSampleStyleSheet()
        
        # Create custom styles based on template
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=template.font_size + 4,
            textColor='black',
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=template.font_size,
            textColor='black',
            alignment=TA_JUSTIFY,
            spaceAfter=12,
            leading=template.font_size * template.line_spacing
        )
        
        # Add title
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 0.3 * inch))
        
        # Process content - split into paragraphs
        paragraphs = content.split('\n\n')
        for para in paragraphs:
            if para.strip():
                # Clean and escape HTML entities
                cleaned_para = para.strip().replace('<', '&lt;').replace('>', '&gt;')
                story.append(Paragraph(cleaned_para, body_style))
                story.append(Spacer(1, 0.1 * inch))
        
        # Build PDF
        doc.build(story)
        
        # Reset buffer position
        buffer.seek(0)
        
        return buffer


# Singleton instance
pdf_export_service = PdfExportService()
