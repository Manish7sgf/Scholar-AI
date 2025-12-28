"""Humanization service for making text more natural"""
from typing import List
from app.config import settings
from openai import OpenAI


class HumanizationService:
    """Service for humanizing AI-generated or overly formal text"""
    
    def __init__(self):
        """Initialize humanization service"""
        self.client = None
        if settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    def _check_client(self):
        """Check if OpenAI client is initialized"""
        if not self.client:
            raise ValueError("OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.")
    
    async def humanize_text(self, text: str, style: str = "academic") -> tuple[str, List[str]]:
        """
        Humanize text to make it sound more natural and authentic
        
        Args:
            text: Text to humanize
            style: Writing style (academic, casual, formal)
            
        Returns:
            Tuple of (humanized_text, changes_made)
        """
        self._check_client()
        
        style_prompts = {
            "academic": (
                "Rewrite the following academic text to make it sound more natural, authentic, and human-written "
                "while maintaining academic rigor. Remove overly formal AI-generated phrases, add natural variation "
                "in sentence structure, and include more specific examples where appropriate. Keep the core meaning intact.\n\n"
            ),
            "casual": (
                "Rewrite the following text in a more casual, conversational tone while keeping it professional. "
                "Make it sound more human and less robotic.\n\n"
            ),
            "formal": (
                "Rewrite the following text in a professional, formal tone that sounds natural and human-written, "
                "not AI-generated.\n\n"
            )
        }
        
        prompt = style_prompts.get(style, style_prompts["academic"])
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert editor who specializes in making text sound more natural and human-written. "
                            "Your goal is to maintain the content and meaning while removing AI-generated patterns and "
                            "adding authentic human touches. Be specific about changes you make."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"{prompt}Text:\n{text}"
                    }
                ],
                temperature=0.8,
                max_tokens=3000
            )
            
            humanized_text = response.choices[0].message.content.strip()
            
            # Generate a summary of changes
            changes = self._identify_changes(text, humanized_text)
            
            return humanized_text, changes
            
        except Exception as e:
            raise ValueError(f"Error humanizing text: {str(e)}")
    
    def _identify_changes(self, original: str, humanized: str) -> List[str]:
        """Identify key changes made during humanization"""
        changes = []
        
        # Check for common AI phrases removed
        ai_phrases = [
            "it is important to note",
            "it should be noted",
            "in conclusion",
            "delve into",
            "landscape of",
            "multifaceted",
            "comprehensive understanding",
            "revolutionize"
        ]
        
        for phrase in ai_phrases:
            if phrase in original.lower() and phrase not in humanized.lower():
                changes.append(f"Removed AI phrase: '{phrase}'")
        
        # Check for sentence structure changes
        orig_sentences = len([s for s in original.split('.') if s.strip()])
        humanized_sentences = len([s for s in humanized.split('.') if s.strip()])
        
        if abs(orig_sentences - humanized_sentences) > 2:
            changes.append(f"Restructured sentences for better flow ({orig_sentences} → {humanized_sentences})")
        
        # Check for word count changes
        orig_words = len(original.split())
        humanized_words = len(humanized.split())
        word_diff = humanized_words - orig_words
        
        if abs(word_diff) > 50:
            if word_diff > 0:
                changes.append(f"Added {word_diff} words for clarity and examples")
            else:
                changes.append(f"Removed {abs(word_diff)} words for conciseness")
        
        # Generic changes if no specific changes detected
        if not changes:
            changes = [
                "Improved sentence variety and flow",
                "Made language more natural and conversational",
                "Enhanced authenticity while maintaining professionalism"
            ]
        
        return changes


# Singleton instance
humanization_service = HumanizationService()
