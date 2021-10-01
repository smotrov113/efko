from src.app import app, db
from src.lib.api import jsonify, abort, request

from src.lib.serialize import Mapper, Field
from src.services.main.mapping import param_marshal
from src.services.main.access import user_authorization
from src.services.main.access import username_authorization

from src.model import Users
from src.scheme import UsersScheme

class RouteLoginScheme(Mapper):
  __type__ = dict
  username = Field.String(required=True)
  
@app.route('/auth', methods=['POST'])
def route_auth():
  authorization = user_authorization(request)
  ##################
  current_user = authorization['user']
  ##################
  return UsersScheme(obj=current_user).serialize()

@app.route('/login', methods=['POST'])
def route_login():
  ##################
  param = param_marshal(request, RouteLoginScheme)
  authorization = username_authorization(param['username'])
  ##################
  current_user = authorization['user']
  ##################
  return UsersScheme(obj=current_user).serialize(role='authenticate')