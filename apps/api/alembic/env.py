"""Alembic env.py — VaidyaCare.

IMPORTANT (neon-postgres skill §Gotchas):
  Uses DATABASE_URL_UNPOOLED (direct, no -pooler suffix) for migrations.
  Never use the pooled URL here — PgBouncer transaction mode breaks Alembic's
  prepared statements and SET search_path calls silently.
"""
import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# Import the shared Base + all models so autogenerate picks up every table.
# Add new models here as they are implemented.
from app.database import Base  # noqa: F401
from app.config import settings

# Import all ORM models — autogenerate needs them in metadata
import app.models.patient           # noqa: F401
import app.models.visit             # noqa: F401
import app.models.constitution      # noqa: F401
import app.models.imbalance         # noqa: F401
import app.models.clinical_exam     # noqa: F401
import app.models.patient_assessment  # noqa: F401
import app.models.disease_analysis  # noqa: F401
import app.models.finding_code      # noqa: F401
import app.models.dictation         # noqa: F401
import app.models.terminology       # noqa: F401
import app.models.citation          # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# ── Override sqlalchemy.url with DATABASE_URL_UNPOOLED (direct connection) ────
config.set_main_option("sqlalchemy.url", settings.async_database_url_unpooled)


def run_migrations_offline() -> None:
    """Run migrations without a DB connection (SQL output only)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations using the async engine against the DIRECT (unpooled) URL."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # NullPool — no connection reuse during migrations
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
