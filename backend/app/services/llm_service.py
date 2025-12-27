"""LLM service for OpenAI API integration"""
from typing import Optional, List
from openai import OpenAI
from app.config import settings
from app.models.schemas import WritingAction


class LLMService:
    """Service for LLM-powered writing assistance"""
    
    def __init__(self):
        """Initialize OpenAI client"""
        self.client = None
        if settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    def _check_client(self):
        """Check if OpenAI client is initialized"""
        if not self.client:
            raise ValueError("OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.")
    
    async def improve_text(self, text: str, action: WritingAction) -> str:
        """
        Improve text based on action
        
        Args:
            text: Text to improve
            action: Type of improvement
            
        Returns:
            Improved text
        """
        self._check_client()
        
        prompts = {
            WritingAction.improve_clarity: (
                "Improve the clarity and readability of the following academic text. "
                "Make it more concise and easier to understand while maintaining academic rigor:\n\n"
            ),
            WritingAction.make_formal: (
                "Rewrite the following text in a more formal academic style. "
                "Use appropriate academic language and structure:\n\n"
            ),
            WritingAction.simplify: (
                "Simplify the following academic text. Make it easier to understand "
                "while retaining the core meaning and key concepts:\n\n"
            ),
            WritingAction.expand: (
                "Expand the following text with more details and explanations. "
                "Add relevant context and elaborate on key points:\n\n"
            ),
            WritingAction.summarize: (
                "Summarize the following text concisely. Capture the main points "
                "and key findings in a brief format:\n\n"
            ),
            WritingAction.fix_grammar: (
                "Fix grammar, spelling, and punctuation errors in the following text. "
                "Maintain the original meaning and style:\n\n"
            )
        }
        
        prompt = prompts.get(action, prompts[WritingAction.improve_clarity])
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert academic writing assistant. Help improve research papers while maintaining academic integrity."
                    },
                    {
                        "role": "user",
                        "content": f"{prompt}{text}"
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise ValueError(f"Error improving text: {str(e)}")
    
    async def generate_section(
        self,
        section_name: str,
        context: str,
        key_points: Optional[List[str]] = None
    ) -> str:
        """
        Generate content for a paper section
        
        Args:
            section_name: Name of the section
            context: Context about the paper
            key_points: Optional key points to include
            
        Returns:
            Generated section content
        """
        self._check_client()
        
        prompt = f"Write the {section_name} section for an academic paper.\n\n"
        prompt += f"Context: {context}\n\n"
        
        if key_points:
            prompt += "Key points to include:\n"
            for point in key_points:
                prompt += f"- {point}\n"
            prompt += "\n"
        
        prompt += f"Generate a well-structured {section_name} section that is appropriate for academic publication."
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert academic writing assistant. Help write high-quality research paper sections."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.8,
                max_tokens=2000
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise ValueError(f"Error generating section: {str(e)}")
    
    async def chat(self, message: str, context: Optional[str] = None) -> str:
        """
        Chat with AI assistant
        
        Args:
            message: User message
            context: Optional context about the paper
            
        Returns:
            AI response
        """
        self._check_client()
        
        system_message = (
            "You are a helpful academic writing assistant for ScholarAI. "
            "Help researchers write better papers, provide feedback, and answer questions "
            "about academic writing and research methodology. Maintain academic integrity "
            "and encourage original work."
        )
        
        messages = [{"role": "system", "content": system_message}]
        
        if context:
            messages.append({
                "role": "system",
                "content": f"Current paper context: {context}"
            })
        
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1500
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise ValueError(f"Error in chat: {str(e)}")


# Singleton instance
llm_service = LLMService()
