from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "TechSpend AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkeychangeinproduction"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    DATABASE_URL: str = "postgresql://techspend_user:techspend_password@db:5432/techspend_db"
    REDIS_URL: str = "redis://redis:6379/0"
    ENVIRONMENT: str = "development"

    model_config = ConfigDict(case_sensitive=True)

settings = Settings()
