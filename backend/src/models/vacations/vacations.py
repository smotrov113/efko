from src.app import db
from src.lib.serialize import Mapper, Field
from src.lib.sqlalchemy import uuid, timestamp
from src.lib.serialize import Blacklist, Whitelist

class Vacations(db.Model):
  __tablename__ = 'vacations'
  ##################
  id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=uuid())
  created_at = db.Column(db.DateTime(timezone=False), server_default=timestamp())
  updated_at = db.Column(db.DateTime(timezone=False), server_default=timestamp(), onupdate=timestamp())
  ##################
  year = db.Column(db.DateTime(timezone=False))
  is_agreed = db.Column(db.Boolean, default=False)
  ##################
  user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id', onupdate='CASCADE', ondelete='CASCADE'))
  user = db.relationship('Users', lazy='joined', uselist=False, foreign_keys=[user_id])
  ##################
  date_end = db.Column(db.DateTime(timezone=False))
  date_start = db.Column(db.DateTime(timezone=False))
  ##################

class VacationsScheme(Mapper):
  __type__ = Vacations
  id = Field.UUID(required=False)
  year = Field.DateTimeUTC(required=False)
  is_agreed = Field.Boolean(required=False)
  date_end = Field.DateTimeUTC(required=False)
  date_start = Field.DateTimeUTC(required=False)
  user = Field.Nested('UsersScheme', required=False, allow_create=True)