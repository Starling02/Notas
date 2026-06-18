import os


class Settings:
    """Configuracion leida de variables de entorno con fallbacks de desarrollo."""

    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "dev-secret-key-change-me-not-for-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./notes.db")


settings = Settings()
