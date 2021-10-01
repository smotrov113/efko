from uuid import uuid4
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID

############
def SQLAlchemyUUID(db):
  db.UUID = UUID
  return db
############
def uuid():
  return text('uuid_generate_v4()')
############
def timestamp():
  return text("(NOW() AT TIME ZONE 'UTC')")