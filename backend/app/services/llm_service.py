"""LLM service for OpenRouter and OpenAI API integration with smart model switching"""
from typing import Optional, List
from openai import OpenAI
from app.config import settings
from app.models.schemas import WritingAction


# Model mapping for smart switching (OpenRouter free models)
TASK_MODEL_MAPPING = {
    # Writing Tasks → Mistral 7B (best for writing)
    "improve_clarity": "mistralai/mistral-7b-instruct:free",
    "fix_grammar": "mistralai/mistral-7b-instruct:free",
    "simplify": "mistralai/mistral-7b-instruct:free",
    
    # Academic Tasks → Gemma 2 9B (best for formal/academic)
    "make_formal": "google/gemma-2-9b-it:free",
    "generate_section": "google/gemma-2-9b-it:free",
    
    # Quick Tasks → Llama 3.2 3B (fastest)
    "chat": "meta-llama/llama-3.2-3b-instruct:free",
    "quick_suggestion": "meta-llama/llama-3.2-3b-instruct:free",
    
    # Reasoning Tasks → Qwen 2 7B (best for reasoning)
    "brainstorm": "qwen/qwen-2-7b-instruct:free",
    "outline": "qwen/qwen-2-7b-instruct:free",
    "expand": "qwen/qwen-2-7b-instruct:free",
    "summarize": "qwen/qwen-2-7b-instruct:free",
    "methodology": "qwen/qwen-2-7b-instruct:free",
}

# Available models with metadata
AVAILABLE_MODELS = [
    {
        "id": "mistralai/mistral-7b-instruct:free",
        "name": "Mistral 7B",
        "icon": "✍️",
        "description": "Writing, grammar, clarity"
    },
    {
        "id": "google/gemma-2-9b-it:free",
        "name": "Gemma 2 9B",
        "icon": "🎓",
        "description": "Academic, formal writing"
    },
    {
        "id": "meta-llama/llama-3.2-3b-instruct:free",
        "name": "Llama 3.2 3B",
        "icon": "⚡",
        "description": "Fast responses, chat"
    },
    {
        "id": "qwen/qwen-2-7b-instruct:free",
        "name": "Qwen 2 7B",
        "icon": "🧠",
        "description": "Reasoning, brainstorming"
    }
]


class LLMService:
    """Service for LLM-powered writing assistance with OpenRouter and smart model switching"""
    
    def __init__(self):
        """Initialize OpenRouter/OpenAI client"""
        self.client = None
        self.use_openrouter = False
        self.default_model = settings.default_model  # Set default regardless
        
        # Try OpenRouter first (recommended)
        if settings.openrouter_api_key:
            self.client = OpenAI(
                api_key=settings.openrouter_api_key,
                base_url="https://openrouter.ai/api/v1"
            )
            self.use_openrouter = True
            self.default_model = settings.default_model
        # Fallback to OpenAI for backward compatibility
        elif settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)
            self.use_openrouter = False
            self.default_model = settings.openai_model
        
        self.smart_switching = settings.smart_model_switching
    
    def _check_client(self):
        """Check if client is initialized"""
        if not self.client:
            raise ValueError(
                "API key not configured. Please set OPENROUTER_API_KEY or OPENAI_API_KEY in environment variables."
            )
    
    def _get_model_for_task(self, task: str) -> str:
        """
        Get the best model for a specific task based on smart switching settings
        
        Args:
            task: Task identifier (e.g., 'improve_clarity', 'brainstorm')
            
        Returns:
            Model ID to use
        """
        if not self.use_openrouter or not self.smart_switching:
            return self.default_model
        
        return TASK_MODEL_MAPPING.get(task, self.default_model)
    
    async def improve_text(self, text: str, action: WritingAction) -> str:
        """
        Improve text based on action with smart model selection
        
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
        
        # Get the best model for this task
        model = self._get_model_for_task(action.value)
        
        try:
            response = self.client.chat.completions.create(
                model=model,
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
        Generate content for a paper section with smart model selection
        
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
        
        # Use Gemma 2 9B for academic section generation
        model = self._get_model_for_task("generate_section")
        
        try:
            response = self.client.chat.completions.create(
                model=model,
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
        Chat with AI assistant using fast model for quick responses
        
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
        
        # Use Llama 3.2 3B for fast chat responses
        model = self._get_model_for_task("chat")
        
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=1500
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise ValueError(f"Error in chat: {str(e)}")
    
    def get_available_models(self) -> List[dict]:
        """
        Get list of available models
        
        Returns:
            List of model metadata
        """
        if self.use_openrouter:
            return AVAILABLE_MODELS
        else:
            return [{
                "id": self.default_model,
                "name": "OpenAI",
                "icon": "🤖",
                "description": "OpenAI model"
            }]
    
    def get_current_settings(self) -> dict:
        """
        Get current LLM service settings
        
        Returns:
            Dictionary with current settings
        """
        return {
            "provider": "OpenRouter" if self.use_openrouter else "OpenAI",
            "default_model": self.default_model,
            "smart_switching": self.smart_switching and self.use_openrouter,
            "available_models": self.get_available_models()
        }


# Singleton instance
llm_service = LLMService()
