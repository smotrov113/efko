from src.app import app, db
from src.lib.api import abort, jsonify, request

from src.lib.serialize import Mapper, Field
from src.services.main.mapping import param_marshal

from src.model import Users
from src.scheme import UsersScheme

@app.route('/users/<request_type>', methods=['POST'])
def route_users_record(request_type=None):
  if request_type == 'create':
    return users_record(1)
  elif request_type == 'update':
    return users_record(2)
  elif request_type == 'delete':
    return users_record(3)
  else:
    abort(404)

def users_record(request_type):
  ##################
  param = param_marshal(request, UsersScheme)
  ##################
  if request_type == 3:
    abort(500)
  elif request_type == 1 or request_type == 2:
    rec_doc = record_doc(request_type, param)
    db.session.commit()
  ################
  return UsersScheme(obj=rec_doc).serialize()

def record_doc(request_type, param):
  ################
  record = Users(
    id = param.id,
    is_director = param.is_director,
  )
  ################
  record = db.session.merge(record)
  ################
  db.session.flush()
  db.session.refresh(record)
  ################
  return record