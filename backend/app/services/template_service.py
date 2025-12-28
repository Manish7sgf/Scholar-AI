"""Template service for journal formats"""
from typing import Dict, List
from app.models.schemas import TemplateFormat


class TemplateService:
    """Service for managing journal templates"""
    
    def __init__(self):
        """Initialize templates"""
        self.templates: Dict[str, TemplateFormat] = {
            "ieee": TemplateFormat(
                name="ieee",
                display_name="IEEE",
                citation_style="IEEE",
                font_family="Times New Roman",
                font_size=10,
                line_spacing=1.0,
                margin_top=0.75,
                margin_bottom=1.0,
                margin_left=0.75,
                margin_right=0.75,
                sections=[
                    "Abstract",
                    "Introduction",
                    "Related Work",
                    "Methodology",
                    "Results",
                    "Discussion",
                    "Conclusion",
                    "References"
                ],
                word_limit=6000,
                abstract_word_limit=150
            ),
            "springer": TemplateFormat(
                name="springer",
                display_name="Springer Nature",
                citation_style="APA",
                font_family="Times New Roman",
                font_size=12,
                line_spacing=1.5,
                margin_top=1.0,
                margin_bottom=1.0,
                margin_left=1.0,
                margin_right=1.0,
                sections=[
                    "Abstract",
                    "Keywords",
                    "Introduction",
                    "Materials and Methods",
                    "Results",
                    "Discussion",
                    "Conclusion",
                    "References"
                ],
                word_limit=8000,
                abstract_word_limit=250
            ),
            "elsevier": TemplateFormat(
                name="elsevier",
                display_name="Elsevier",
                citation_style="Harvard",
                font_family="Arial",
                font_size=11,
                line_spacing=1.5,
                margin_top=1.0,
                margin_bottom=1.0,
                margin_left=1.0,
                margin_right=1.0,
                sections=[
                    "Abstract",
                    "Keywords",
                    "Introduction",
                    "Literature Review",
                    "Methodology",
                    "Results and Discussion",
                    "Conclusion",
                    "References"
                ],
                word_limit=7000,
                abstract_word_limit=200
            ),
            "acm": TemplateFormat(
                name="acm",
                display_name="ACM",
                citation_style="ACM",
                font_family="Libertine",
                font_size=10,
                line_spacing=1.0,
                margin_top=1.0,
                margin_bottom=1.0,
                margin_left=1.0,
                margin_right=1.0,
                sections=[
                    "Abstract",
                    "CCS Concepts",
                    "Keywords",
                    "Introduction",
                    "Background",
                    "Approach",
                    "Evaluation",
                    "Related Work",
                    "Conclusion",
                    "References"
                ],
                word_limit=10000,
                abstract_word_limit=150
            ),
            "apa7": TemplateFormat(
                name="apa7",
                display_name="APA 7th Edition",
                citation_style="APA 7th",
                font_family="Times New Roman",
                font_size=12,
                line_spacing=2.0,
                margin_top=1.0,
                margin_bottom=1.0,
                margin_left=1.0,
                margin_right=1.0,
                sections=[
                    "Abstract",
                    "Introduction",
                    "Method",
                    "Results",
                    "Discussion",
                    "References"
                ],
                abstract_word_limit=250
            ),
            "mla9": TemplateFormat(
                name="mla9",
                display_name="MLA 9th Edition",
                citation_style="MLA 9th",
                font_family="Times New Roman",
                font_size=12,
                line_spacing=2.0,
                margin_top=1.0,
                margin_bottom=1.0,
                margin_left=1.0,
                margin_right=1.0,
                sections=[
                    "Introduction",
                    "Body",
                    "Conclusion",
                    "Works Cited"
                ]
            )
        }
    
    def get_all_templates(self) -> List[TemplateFormat]:
        """Get all available templates"""
        return list(self.templates.values())
    
    def get_template(self, format_name: str) -> TemplateFormat:
        """Get specific template by name"""
        if format_name not in self.templates:
            raise ValueError(f"Template '{format_name}' not found")
        return self.templates[format_name]
    
    def get_template_names(self) -> List[str]:
        """Get list of template names"""
        return list(self.templates.keys())


# Singleton instance
template_service = TemplateService()
