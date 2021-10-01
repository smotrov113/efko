import uuid, datetime
from kim import field
from kim.field import String
from datetime import timezone
from kim.pipelines.base import pipe
from kim.role import whitelist, blacklist
from kim.mapper import Mapper, MappingInvalid
from kim.pipelines.serialization import SerializePipeline

######### PIPE - OPEN #########
@pipe()
def date_validation(session):
  if session.data is not None:
    try:
      session.data = datetime.datetime.utcfromtimestamp(int(session.data)/1000)
    except:
      raise session.field.invalid('date_invalid')
  return session.data

@pipe()
def date_output(session):
  if session.data is not None and isinstance(session.data, datetime.date):
    try:
      session.data = int(session.data.replace(tzinfo=timezone.utc).timestamp()*1000)
    except:
      raise session.field.invalid('date_invalid')
  return session.data

@pipe()
def numeric_validation(session):
  if session.data is not None:
    try:
      session.data = float(session.data)
    except:
      raise session.field.invalid('numeric_invalid')
  return session.data

@pipe()
def numeric_output(session):
  if session.data is not None:
    try:
      session.data = float(session.data)
    except:
      raise session.field.invalid('numeric_invalid')
  return session.data

@pipe()
def uuid_validation(session):
  if session.data is not None:
    try:
      session.data = uuid.UUID(session.data)
    except:
      raise session.field.invalid('uuid_invalid')
  return session.data

@pipe()
def uuid_output(session):
  if session.data is not None:
    try:
      session.data = str(session.data)
    except:
      raise session.field.invalid('uuid_invalid')
  return session.data
######### CLOSE - OPEN #########


######### DATETIME UTC - OPEN #########
class DateTimeUTCSerializePipeline(SerializePipeline):
  process_pipes = SerializePipeline.process_pipes + [date_output]

class FieldToDateTimeUTC(String):
  serialize_pipeline = DateTimeUTCSerializePipeline

def DateTimeUTC(required=False, read_only=False):
  return FieldToDateTimeUTC(required=required, read_only=read_only, extra_marshal_pipes={'validation': [date_validation]},error_msgs={'date_invalid': 'Invalid type'})
######### DATETIME UTC - CLOSE #########


######### NUMERIC - OPEN #########
class NumericSerializePipeline(SerializePipeline):
  process_pipes = SerializePipeline.process_pipes + [numeric_output]

class FieldToNumeric(String):
  serialize_pipeline = NumericSerializePipeline

def Numeric(required=False, read_only=False):
  return FieldToNumeric(required=required, read_only=read_only, extra_marshal_pipes={'validation': [numeric_validation]},error_msgs={'numeric_invalid': 'Invalid type'})
######### NUMERIC - CLOSE #########


######### UUID - OPEN #########
class UUIDSerializePipeline(SerializePipeline):
  process_pipes = SerializePipeline.process_pipes + [uuid_output]

class FieldToUUID(String):
  serialize_pipeline = UUIDSerializePipeline

def UUID(required=False, read_only=False):
  return FieldToUUID(required=required, read_only=read_only, extra_marshal_pipes={'validation': [uuid_validation]},error_msgs={'uuid_invalid': 'Invalid type'})
######### NUMERIC - CLOSE #########


######### KIM - OPEN #########
Field = field
Mapper = Mapper
Blacklist = blacklist
Whitelist = whitelist
MappingInvalid = MappingInvalid
Field.UUID = UUID
Field.Numeric = Numeric
Field.DateTimeUTC = DateTimeUTC
######### KIM - CLOSE #########