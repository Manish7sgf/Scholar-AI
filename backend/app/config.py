"""Configuration management for ScholarAI backend"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # OpenRouter Configuration (replaces OpenAI)
    openrouter_api_key: str = ""
    default_model: str = "mistralai/mistral-7b-instruct:free"
    smart_model_switching: bool = True
    
    # Legacy OpenAI support (for backward compatibility)
    openai_api_key: str = ""
    openai_model: str = "gpt-4-turbo-preview"
    
    # CORS Configuration
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    
    # Application Settings
    app_name: str = "ScholarAI"
    app_version: str = "1.0.0"
    debug: bool = False
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
