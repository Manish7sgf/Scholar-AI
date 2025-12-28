"""AI detection service for transparency and disclosure"""
import re
from typing import List, Tuple
from app.models.schemas import DetectionResult, AILevel


class DetectorService:
    """
    Service for detecting AI-generated content
    
    ETHICAL PURPOSE: This detector is designed for TRANSPARENCY, not evasion.
    It helps authors identify AI-generated content so they can properly disclose
    AI usage in their journal submissions, maintaining academic integrity.
    """
    
    def __init__(self):
        """Initialize detector with patterns"""
        # Patterns that may indicate AI-generated content
        self.ai_patterns = [
            # Common AI phrases
            (r"\b(it is important to note|it should be noted|it is worth noting)\b", 2),
            (r"\b(in conclusion|in summary|to summarize)\b", 1),
            (r"\b(delve into|dive deep|explore the nuances)\b", 3),
            (r"\b(landscape of|realm of|sphere of)\b", 2),
            (r"\b(multifaceted|holistic approach|comprehensive understanding)\b", 2),
            (r"\b(it is crucial|it is essential|it is imperative)\b", 2),
            (r"\b(navigate the complexities|foster innovation|drive progress)\b", 3),
            (r"\b(revolutionize|transform|reshape)\b", 1),
            (r"\b(cutting-edge|state-of-the-art|groundbreaking)\b", 1),
            (r"\b(furthermore|moreover|additionally|consequently)\b", 1),
            
            # Overly formal or repetitive structures
            (r"\bthis (?:paper|study|research|article)\s+(?:aims to|seeks to|attempts to)\b", 2),
            (r"\bin (?:this|the current|today's) (?:digital age|modern era|contemporary world)\b", 3),
            (r"\bthe (?:importance|significance|relevance) of .+? cannot be overstated\b", 3),
        ]
    
    def detect(self, text: str) -> DetectionResult:
        """
        Analyze text for AI-generated content patterns
        
        Args:
            text: Text to analyze
            
        Returns:
            DetectionResult with score, level, flagged sections, and suggestions
        """
        if not text or len(text.strip()) < 50:
            return DetectionResult(
                score=0,
                level=AILevel.low,
                flagged_sections=[],
                suggestions=["Text too short for reliable analysis"]
            )
        
        # Calculate AI likelihood score
        score, flagged = self._calculate_score(text)
        
        # Determine level
        level = self._determine_level(score)
        
        # Generate suggestions
        suggestions = self._generate_suggestions(score, level, len(flagged))
        
        return DetectionResult(
            score=score,
            level=level,
            flagged_sections=flagged,
            suggestions=suggestions
        )
    
    def _calculate_score(self, text: str) -> Tuple[int, List[str]]:
        """Calculate AI detection score and flag sections"""
        text_lower = text.lower()
        total_score = 0
        flagged_sections = []
        
        # Check for AI patterns
        for pattern, weight in self.ai_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                total_score += len(matches) * weight
                # Extract context around match
                for match in matches[:3]:  # Limit to first 3 matches per pattern
                    if isinstance(match, tuple):
                        match = match[0]
                    context = self._extract_context(text, match)
                    if context and context not in flagged_sections:
                        flagged_sections.append(context)
        
        # Additional heuristics
        sentences = text.split('.')
        if len(sentences) > 5:
            # Check for repetitive sentence structures
            avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences)
            if 20 <= avg_sentence_length <= 25:
                total_score += 5
            
            # Check for consistent sentence lengths (AI tends to be more uniform)
            sentence_lengths = [len(s.split()) for s in sentences if len(s.strip()) > 0]
            if len(sentence_lengths) > 5:
                variance = sum((l - avg_sentence_length) ** 2 for l in sentence_lengths) / len(sentence_lengths)
                if variance < 30:  # Low variance indicates uniformity
                    total_score += 5
        
        # Normalize score to 0-100
        normalized_score = min(100, int((total_score / max(len(text.split()) * 0.1, 10)) * 100))
        
        return normalized_score, flagged_sections[:10]  # Limit to 10 flagged sections
    
    def _extract_context(self, text: str, match: str, context_words: int = 15) -> str:
        """Extract context around a matched phrase"""
        # Find the match in original text (case-insensitive)
        pattern = re.compile(re.escape(match), re.IGNORECASE)
        match_obj = pattern.search(text)
        
        if not match_obj:
            return ""
        
        start = match_obj.start()
        end = match_obj.end()
        
        # Find sentence boundaries
        sentence_start = text.rfind('.', 0, start) + 1
        sentence_end = text.find('.', end)
        if sentence_end == -1:
            sentence_end = len(text)
        
        context = text[sentence_start:sentence_end].strip()
        return context[:200]  # Limit context length
    
    def _determine_level(self, score: int) -> AILevel:
        """Determine AI detection level from score"""
        if score < 30:
            return AILevel.low
        elif score < 60:
            return AILevel.medium
        else:
            return AILevel.high
    
    def _generate_suggestions(self, score: int, level: AILevel, num_flagged: int) -> List[str]:
        """Generate suggestions based on detection results"""
        suggestions = []
        
        if level == AILevel.low:
            suggestions.append(
                "Text shows low indicators of AI generation. Minimal AI disclosure may be needed."
            )
            suggestions.append(
                "Consider disclosing any AI tools used for editing, proofreading, or brainstorming."
            )
        elif level == AILevel.medium:
            suggestions.append(
                "Text shows moderate indicators of AI generation. Consider reviewing flagged sections."
            )
            suggestions.append(
                "Recommend including an AI disclosure statement describing how AI tools were used."
            )
            suggestions.append(
                "Review flagged sections for overly formal or generic language and add personal insights."
            )
        else:  # high
            suggestions.append(
                "Text shows high indicators of AI generation. Thorough review recommended."
            )
            suggestions.append(
                "REQUIRED: Include comprehensive AI disclosure statement for journal submission."
            )
            suggestions.append(
                "Strongly recommend rewriting flagged sections to add original analysis and insights."
            )
            suggestions.append(
                "Ensure all AI-generated content is properly attributed and meets journal guidelines."
            )
        
        if num_flagged > 0:
            suggestions.append(
                f"Review {num_flagged} flagged section(s) for common AI-generated phrases and patterns."
            )
        
        return suggestions
    
    def generate_disclosure(self, ai_tools: List[str], purpose: str) -> str:
        """
        Generate AI disclosure statement for journal submission
        
        Args:
            ai_tools: List of AI tools used
            purpose: Purpose of AI usage
            
        Returns:
            Formatted disclosure statement
        """
        tools_text = ", ".join(ai_tools) if ai_tools else "AI writing assistance tools"
        
        disclosure = f"""AI Disclosure Statement

The authors acknowledge the use of {tools_text} for {purpose}. """
        
        disclosure += """The authors take full responsibility for the content of this publication and confirm that all AI-generated suggestions were reviewed, validated, and integrated appropriately. """
        
        disclosure += """The final manuscript reflects the authors' original research, analysis, and conclusions. """
        
        disclosure += """All uses of AI tools comply with the ethical guidelines and policies of the submitting journal."""
        
        return disclosure


# Singleton instance
detector_service = DetectorService()
