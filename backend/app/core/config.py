from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sports_db"
    API_FOOTBALL_KEY: Optional[str] = None
    FOOTBALL_DATA_KEY: Optional[str] = None
    SCRAPER_USER_AGENT: str = "Mozilla/5.0 (compatible; SportsBot/1.0)"
    SCRAPER_DELAY: int = 2
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()