"""Brainstorm service for generating paper outlines"""
from typing import Dict, List, Any
from app.models.schemas import ResearchType


class BrainstormService:
    """Service for generating paper outlines and structure"""
    
    def __init__(self):
        """Initialize brainstorm templates"""
        self.research_structures = {
            ResearchType.experimental: {
                "sections": [
                    {"name": "Abstract", "description": "Brief summary of the experiment"},
                    {"name": "Introduction", "description": "Background and research question"},
                    {"name": "Literature Review", "description": "Related work and gap analysis"},
                    {"name": "Methodology", "description": "Experimental design and procedures"},
                    {"name": "Results", "description": "Data presentation and analysis"},
                    {"name": "Discussion", "description": "Interpretation and implications"},
                    {"name": "Conclusion", "description": "Summary and future work"},
                    {"name": "References", "description": "Citations"}
                ],
                "methodology_focus": [
                    "Define clear hypotheses",
                    "Describe experimental setup and materials",
                    "Explain data collection procedures",
                    "Detail statistical analysis methods",
                    "Address validity and reliability"
                ]
            },
            ResearchType.review: {
                "sections": [
                    {"name": "Abstract", "description": "Overview of review scope"},
                    {"name": "Introduction", "description": "Review purpose and significance"},
                    {"name": "Methodology", "description": "Search strategy and selection criteria"},
                    {"name": "Results", "description": "Synthesis of findings"},
                    {"name": "Discussion", "description": "Analysis and critical evaluation"},
                    {"name": "Conclusion", "description": "Summary and recommendations"},
                    {"name": "References", "description": "Comprehensive bibliography"}
                ],
                "methodology_focus": [
                    "Define search strategy and databases",
                    "Establish inclusion/exclusion criteria",
                    "Describe screening process",
                    "Explain synthesis methods",
                    "Assess quality of reviewed studies"
                ]
            },
            ResearchType.case_study: {
                "sections": [
                    {"name": "Abstract", "description": "Case overview"},
                    {"name": "Introduction", "description": "Context and research questions"},
                    {"name": "Background", "description": "Theoretical framework"},
                    {"name": "Case Description", "description": "Detailed case presentation"},
                    {"name": "Analysis", "description": "Data analysis and findings"},
                    {"name": "Discussion", "description": "Implications and lessons learned"},
                    {"name": "Conclusion", "description": "Key takeaways"},
                    {"name": "References", "description": "Citations"}
                ],
                "methodology_focus": [
                    "Define case selection criteria",
                    "Describe data collection methods",
                    "Explain analytical framework",
                    "Address generalizability",
                    "Ensure ethical considerations"
                ]
            },
            ResearchType.theoretical: {
                "sections": [
                    {"name": "Abstract", "description": "Theory overview"},
                    {"name": "Introduction", "description": "Motivation and objectives"},
                    {"name": "Background", "description": "Existing theories and concepts"},
                    {"name": "Theoretical Framework", "description": "Proposed theory or model"},
                    {"name": "Analysis", "description": "Theoretical development"},
                    {"name": "Implications", "description": "Theoretical and practical implications"},
                    {"name": "Conclusion", "description": "Contributions and future directions"},
                    {"name": "References", "description": "Citations"}
                ],
                "methodology_focus": [
                    "Define theoretical constructs",
                    "Develop propositions or axioms",
                    "Establish logical arguments",
                    "Compare with existing theories",
                    "Discuss theoretical contributions"
                ]
            },
            ResearchType.survey: {
                "sections": [
                    {"name": "Abstract", "description": "Survey summary"},
                    {"name": "Introduction", "description": "Research context and objectives"},
                    {"name": "Literature Review", "description": "Related research"},
                    {"name": "Methodology", "description": "Survey design and administration"},
                    {"name": "Results", "description": "Statistical analysis and findings"},
                    {"name": "Discussion", "description": "Interpretation and implications"},
                    {"name": "Conclusion", "description": "Summary and recommendations"},
                    {"name": "References", "description": "Citations"}
                ],
                "methodology_focus": [
                    "Design questionnaire and instruments",
                    "Define target population and sampling",
                    "Describe data collection procedures",
                    "Explain statistical analysis methods",
                    "Address response rate and bias"
                ]
            }
        }
    
    def generate_outline(
        self,
        topic: str,
        research_type: ResearchType,
        field: str
    ) -> Dict[str, Any]:
        """
        Generate paper outline based on topic and research type
        
        Args:
            topic: Research topic
            research_type: Type of research paper
            field: Academic field
            
        Returns:
            Dictionary with title suggestions, structure, key points, methodology, and references
        """
        structure_template = self.research_structures.get(research_type)
        
        if not structure_template:
            raise ValueError(f"Unknown research type: {research_type}")
        
        # Generate title suggestions
        title_suggestions = self._generate_titles(topic, research_type, field)
        
        # Get structure
        structure = structure_template["sections"]
        
        # Generate key points
        key_points = self._generate_key_points(topic, research_type, field)
        
        # Get methodology suggestions
        methodology_suggestions = structure_template["methodology_focus"]
        
        # Generate reference topics
        reference_topics = self._generate_reference_topics(topic, field)
        
        return {
            "title_suggestions": title_suggestions,
            "structure": structure,
            "key_points": key_points,
            "methodology_suggestions": methodology_suggestions,
            "reference_topics": reference_topics
        }
    
    def _generate_titles(self, topic: str, research_type: ResearchType, field: str) -> List[str]:
        """Generate title suggestions"""
        titles = []
        
        if research_type == ResearchType.experimental:
            titles = [
                f"Experimental Analysis of {topic} in {field}",
                f"Investigating {topic}: An Experimental Study",
                f"An Experimental Approach to {topic}",
                f"{topic}: Design, Implementation, and Evaluation"
            ]
        elif research_type == ResearchType.review:
            titles = [
                f"A Systematic Review of {topic} in {field}",
                f"{topic}: A Comprehensive Literature Review",
                f"Recent Advances in {topic}: A Review",
                f"State of the Art in {topic}: A Survey"
            ]
        elif research_type == ResearchType.case_study:
            titles = [
                f"A Case Study of {topic} in {field}",
                f"{topic}: Lessons from a Case Study Analysis",
                f"Examining {topic}: A Case-Based Investigation",
                f"Real-World Application of {topic}: A Case Study"
            ]
        elif research_type == ResearchType.theoretical:
            titles = [
                f"A Theoretical Framework for {topic}",
                f"Towards a Theory of {topic} in {field}",
                f"Conceptualizing {topic}: A Theoretical Perspective",
                f"Theoretical Foundations of {topic}"
            ]
        elif research_type == ResearchType.survey:
            titles = [
                f"A Survey Study on {topic} in {field}",
                f"{topic}: Insights from a Comprehensive Survey",
                f"Understanding {topic}: A Survey-Based Analysis",
                f"Empirical Investigation of {topic}: Survey Results"
            ]
        
        return titles
    
    def _generate_key_points(self, topic: str, research_type: ResearchType, field: str) -> List[str]:
        """Generate key points to address"""
        base_points = [
            f"Define the scope and significance of {topic} in {field}",
            f"Identify gaps in current research on {topic}",
            f"Establish clear research objectives and questions"
        ]
        
        if research_type == ResearchType.experimental:
            base_points.extend([
                "Develop testable hypotheses",
                "Design rigorous experimental methodology",
                "Ensure reproducibility and validity"
            ])
        elif research_type == ResearchType.review:
            base_points.extend([
                "Define comprehensive search strategy",
                "Synthesize findings from multiple sources",
                "Identify trends and future directions"
            ])
        elif research_type == ResearchType.case_study:
            base_points.extend([
                "Provide rich contextual description",
                "Apply relevant theoretical frameworks",
                "Draw generalizable insights"
            ])
        elif research_type == ResearchType.theoretical:
            base_points.extend([
                "Develop novel theoretical constructs",
                "Establish logical propositions",
                "Discuss theoretical contributions"
            ])
        elif research_type == ResearchType.survey:
            base_points.extend([
                "Design valid and reliable instruments",
                "Ensure representative sampling",
                "Apply appropriate statistical methods"
            ])
        
        return base_points
    
    def _generate_reference_topics(self, topic: str, field: str) -> List[str]:
        """Generate reference topics to search"""
        return [
            f"{topic} fundamentals",
            f"{topic} in {field}",
            f"Recent advances in {topic}",
            f"{topic} applications",
            f"{topic} challenges and limitations",
            f"Future directions in {topic}",
            f"{field} research methodologies",
            f"Related work in {field}"
        ]


# Singleton instance
brainstorm_service = BrainstormService()
