import csv, io
from src.app import db
from zipfile import ZipFile

from src.model import Users

archive = ZipFile('./users.zip', 'r')

users_csv = archive.open('users.csv', 'r')
users_csv = io.TextIOWrapper(users_csv, encoding='utf-8-sig')

workers_csv = archive.open('workers.csv', 'r')
workers_csv = io.TextIOWrapper(workers_csv, encoding='utf-8-sig')

positions_csv = archive.open('positions.csv', 'r')
positions_csv = io.TextIOWrapper(positions_csv, encoding='utf-8-sig')

def set_column(source, receiver, key):
  return getattr(source, key) if source else getattr(receiver, key)

####################################
class UsersCSV(db.Model):
  __tablename__ = 'users_csv'
  __table_args__ = {'prefixes': ['TEMPORARY']}
  index = db.Column(db.Numeric(10, 0), default=0)
  id = db.Column(db.UUID(as_uuid=True), primary_key=True)
  ##################
  position = db.Column(db.String(250))
  last_name = db.Column(db.String(250))
  first_name = db.Column(db.String(250))
  middle_name = db.Column(db.String(250))
  ##################

db.metadata.tables['users_csv'].create(db.get_engine())


class PositionsCSV(db.Model):
  __tablename__ = 'positions_csv'
  __table_args__ = {'prefixes': ['TEMPORARY']}
  index = db.Column(db.Numeric(10, 0), default=0)
  id = db.Column(db.UUID(as_uuid=True), primary_key=True)
  ################## 
  name = db.Column(db.String(250))
  ##################

db.metadata.tables['positions_csv'].create(db.get_engine())

class WorkersCSV(db.Model):
  __tablename__ = 'workers_csv'
  __table_args__ = {'prefixes': ['TEMPORARY']}
  index = db.Column(db.Numeric(10, 0), default=0)
  id = db.Column(db.UUID(as_uuid=True), primary_key=True)
  ##################
  user_id = db.Column(db.UUID(as_uuid=True))
  position_id = db.Column(db.UUID(as_uuid=True))
  ##################

db.metadata.tables['workers_csv'].create(db.get_engine())


############### POSITIONS ###############
for row in csv.DictReader(positions_csv, delimiter=';'):
  record = PositionsCSV(
    id = row['id'],
    name = row['name'],
  )
  record = db.session.merge(record)
  db.session.commit()
############### POSITIONS ###############


############### WORKERS ###############
for row in csv.DictReader(workers_csv, delimiter=';'):
  record = WorkersCSV(
    id = row['id'],
    user_id = row['user_id'],
    position_id = row['position_id'],
  )
  record = db.session.add(record)
  db.session.commit()
############### WORKERS ###############


############### USERS ###############
for row in csv.DictReader(users_csv, delimiter=';'):
  query = db.session.query(WorkersCSV, PositionsCSV)
  query = query.outerjoin(PositionsCSV, WorkersCSV.position_id == PositionsCSV.id)
  query = query.filter(WorkersCSV.user_id == row['id'])
  position = query.first()[1].name 

  record = UsersCSV(
    id = row['id'],
    position = position,
    last_name = row['last_name'],
    first_name = row['first_name'],
    middle_name = row['middle_name'],
  )
  record = db.session.merge(record)
  db.session.commit()

#####################################

query = db.session.query(Users, UsersCSV)
query = query.outerjoin(UsersCSV, Users.id == UsersCSV.id, full=True)
query_results = query.all()

for row in query_results:
  ##################
  if not row[1]:
    record_db = db.session.query(Users).get(row[0].id)
    db.session.delete(record_db)
    db.session.commit()
  ##################
  record = Users(
    id = set_column(row[1], row[0], 'id'),
    position = set_column(row[1], row[0], 'position'),
    last_name = set_column(row[1], row[0], 'last_name'),
    first_name = set_column(row[1], row[0], 'first_name'),
    middle_name = set_column(row[1], row[0], 'middle_name'),
  )
  ##################
  if not row[0]:
    record.is_director = False
  elif row[0]:
    if not row[0].is_director:
      record.is_director = False
    elif row[0].is_director:
      record.is_director = row[0].is_director
  ##################
  record = db.session.merge(record)
  db.session.flush()

db.session.commit()
############### USERS ###############