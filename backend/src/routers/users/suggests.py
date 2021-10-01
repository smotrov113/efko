from src.app import app, db
from src.lib.api import abort, jsonify, request

from src.lib.serialize import Mapper, Field
from src.services.main.mapping import param_marshal
from src.services.main.access import user_authorization

from src.model import Users
from src.scheme import UsersScheme

class RouteUsersSuggestsScheme(Mapper):
  __type__ = dict
  search = Field.String(required=True)

@app.route('/users/suggests', methods=['GET'])
def route_users_suggests():
  #################
  current_user = user_authorization(request)['user']
  #################
  data = request.args.to_dict()
  param = RouteUsersSuggestsScheme(data=data).marshal()
  ##################
  ts_search = Users.ts_first_name | Users.ts_last_name | Users.ts_middle_name
  ##################
  query = db.session.query(Users)
  query = query.filter(ts_search.op('@@')(db.func.parse_websearch(param['search'])))
  query_results = query.all()
  ##################
  result = []
  for x in query_results:
    result.append(UsersScheme(obj=x).serialize())

  return jsonify(result)

@app.route('/users/directors/suggests', methods=['GET'])
def route_users_directors_suggests():
  #################
  current_user = user_authorization(request)['user']
  #################
  data = request.args.to_dict()
  param = RouteUsersSuggestsScheme(data=data).marshal()
  ##################
  ts_search = Users.ts_first_name | Users.ts_last_name | Users.ts_middle_name
  ##################
  query_directors = db.session.query(Users.id.label('id'))
  query_directors = query_directors.filter(Users.is_director == True)
  ##################
  query = db.session.query(Users)
  query = query.filter(~Users.id.in_(query_directors))
  query = query.filter(ts_search.op('@@')(db.func.parse_websearch(param['search'])))
  query_results = query.all()
  ##################
  result = []
  for x in query_results:
    result.append(UsersScheme(obj=x).serialize())

  return jsonify(result)