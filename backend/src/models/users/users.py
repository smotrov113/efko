from src.app import db
from src.lib.serialize import Mapper, Field
from src.lib.sqlalchemy import uuid, timestamp
from src.lib.serialize import Blacklist, Whitelist

from flask_sqlalchemy import BaseQuery
from sqlalchemy_searchable import vectorizer
from sqlalchemy_utils.types import TSVectorType
from sqlalchemy_searchable import SearchQueryMixin

from src.services.main.common import create_certificate

class UsersQuery(BaseQuery, SearchQueryMixin):
  pass

class Users(db.Model):
  __tablename__ = 'users'
  query_class = UsersQuery
  ##################
  id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=uuid())
  created_at = db.Column(db.DateTime(timezone=False), server_default=timestamp())
  updated_at = db.Column(db.DateTime(timezone=False), server_default=timestamp(), onupdate=timestamp())
  ##################
  position = db.Column(db.String(250))
  last_name = db.Column(db.String(250))
  first_name = db.Column(db.String(250))
  middle_name = db.Column(db.String(250))
  is_director = db.Column(db.Boolean, default=False)
  certificate = db.Column(db.String(70), unique=True, default=lambda:create_certificate(70))
  ##################
  ts_position = db.Column(TSVectorType('position'))
  ts_last_name = db.Column(TSVectorType('last_name'))
  ts_first_name = db.Column(TSVectorType('first_name'))
  ts_middle_name = db.Column(TSVectorType('middle_name'))
  ##################
  @property
  def username(self):
    return self.last_name+self.first_name[:1].upper()+self.middle_name[:1].upper()
  @property
  def label(self):
    return ' '.join(list(filter(None, [self.last_name, self.first_name, self.middle_name])))

class UsersScheme(Mapper):
  __type__ = Users
  id = Field.UUID(required=False)
  position = Field.String(required=False)
  last_name = Field.String(required=False)
  first_name = Field.String(required=False)
  middle_name = Field.String(required=False)
  certificate = Field.String(required=False)
  is_director = Field.Boolean(required=False)
  label = Field.String(required=False, read_only=True)

  __roles__ = {
    'authenticate': Blacklist(),
    '__default__': Blacklist('certificate'),
  }