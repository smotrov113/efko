from src.app import app, db

from src.lib.serialize import Mapper, Field
from src.lib.api import abort, jsonify, request

from src.services.main.common import error_message
from src.services.main.mapping import param_marshal

from src.model import Users
from src.scheme import UsersScheme

@app.route('/users', methods=['GET'])
def route_users_id():
  ##################
  data = request.args.to_dict()
  param = param_marshal(data, UsersScheme)
  ##################
  record = db.session.query(Users).get(param.id)
  if not record:
    abort(500, error_message(1, 'id'))
  ##################
  return UsersScheme(obj=record).serialize()