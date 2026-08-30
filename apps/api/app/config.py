"""App configuration — reads from environment / .env file."""
from typing import Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── Database (Neon Lakebase Postgres + pgvector) ────────────────────────────
    # Per neon-postgres skill §Gotchas:
    #   DATABASE_URL         → pooled (-pooler suffix), via PgBouncer
    #                          → use for ALL app queries (SQLAlchemy async engine)
    #   DATABASE_URL_UNPOOLED → direct (no -pooler), bypasses PgBouncer
    #                           → use ONLY for Alembic migrations / pg_dump / LISTEN
    database_url: str = "postgresql+asyncpg://placeholder@localhost/vaidyacare"
    database_url_unpooled: str = "postgresql+psycopg2://placeholder@localhost/vaidyacare"

    # Branch metadata from neon env pull
    neon_branch: str = "production"

    # ── Auth ───────────────────────────────────────────────────────────────────
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    # ── AI / Speech ────────────────────────────────────────────────────────────
    whisper_model_size: str = "small"

    # ── CORS ───────────────────────────────────────────────────────────────────
    cors_origins: Union[list[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://vaidyacare.vercel.app",
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[list[str], str]) -> list[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [x.strip() for x in v.split(",") if x.strip()]
        return v

    @field_validator("database_url", "database_url_unpooled", mode="before")
    @classmethod
    def sanitize_db_url(cls, v: str) -> str:
        if not v:
            return "postgresql+asyncpg://placeholder@localhost/vaidyacare"
        v = v.strip().strip("\"'").strip()
        # Ensure driver is asyncpg compatible
        for prefix in ["postgresql+asyncpg://", "postgresql+psycopg2://", "postgresql://", "postgres://"]:
            if v.startswith(prefix):
                v = "postgresql+asyncpg://" + v[len(prefix):]
                break
        return v

    @classmethod
    def _clean_async_url(cls, url: str) -> str:
        if not url:
            return "postgresql+asyncpg://placeholder@localhost/vaidyacare"
        import urllib.parse
        url = url.strip().strip("\"'").strip()
        for prefix in ["postgresql+asyncpg://", "postgresql+psycopg2://", "postgresql://", "postgres://"]:
            if url.startswith(prefix):
                url = "postgresql+asyncpg://" + url[len(prefix):]
                break
        parsed = urllib.parse.urlparse(url)
        query_params = urllib.parse.parse_qs(parsed.query)
        if "sslmode" in query_params:
            ssl_val = query_params.pop("sslmode")[0]
            if ssl_val in ("require", "prefer", "allow", "verify-ca", "verify-full"):
                query_params["ssl"] = ["require"]
        query_params.pop("channel_binding", None)
        new_query = urllib.parse.urlencode(query_params, doseq=True)
        return urllib.parse.urlunparse(parsed._replace(query=new_query))

    @property
    def async_database_url(self) -> str:
        return self._clean_async_url(self.database_url)

    @property
    def async_database_url_unpooled(self) -> str:
        return self._clean_async_url(self.database_url_unpooled)


settings = Settings()

