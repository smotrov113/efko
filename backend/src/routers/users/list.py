from src.app import app, db
from src.lib.api import abort, jsonify, request

from math import ceil
from src.lib.serialize import Mapper, Field
from src.services.main.common import error_message
from src.services.main.mapping import param_marshal
from src.services.main.access import user_authorization

from src.model import Users
from src.scheme import UsersScheme
from src.scheme import PaginatorScheme

class RouteUsersListScheme(Mapper):
  __type__ = dict
  search = Field.String(required=False)
  page = Field.Integer(required=True, min=1, default=1)

@app.route('/users/list', methods=['GET'])
def route_users_list():
  ##################
  page_size = 50
  data = request.args.to_dict()
  param = RouteUsersListScheme(data=data).marshal()
  ##################
  query = db.session.query(Users)

  if param['search'] and len(param['search']) >= 3:
    ts_search = Users.ts_last_name | Users.ts_first_name 
    ts_search = ts_search | Users.ts_middle_name | Users.position
    query = query.filter(ts_search.op('@@')(db.func.parse_websearch(param['search'])))

  offset = page_size * (param['page'] - 1)
  query_count = query.count() if query else 0
  page_total = ceil( query_count / page_size )

  query = query.order_by(Users.created_at.asc())
  query = query.limit(page_size).offset(offset)
  query_results = query.all()
  ##################
  response_param = {
    'page': param['page'],
    'page_size': page_size,
    'count_total': query_count,
    'page_total': page_total if page_total else 1
  }
  ##################
  response_data = []
  for x in query_results:
    response_data.append(UsersScheme(obj=x).serialize())
  ##################
  result = {
    'response': response_data,
    'paginator': response_param
  }
  return jsonify(result)


@app.route('/users/directors/list', methods=['GET'])
def route_users_directors_list():
    #################
    current_user = user_authorization(request)['user']
    ##################
    page_size = 50
    data = request.args.to_dict()
    param = RouteUsersListScheme(data=data).marshal()
    ##################
    query = db.session.query(Users)
    query = query.filter(Users.is_director == True)
    query = query.filter(Users.id != current_user.id)

    if param['search'] and len(param['search']) >= 3:
      ts_search = Users.ts_last_name | Users.ts_first_name 
      ts_search = ts_search | Users.ts_middle_name | Users.position
      query = query.filter(ts_search.op('@@')(db.func.parse_websearch(param['search'])))

    offset = page_size * (param['page'] - 1)
    query_count = query.count() if query else 0
    page_total = ceil( query_count / page_size )

    query = query.order_by(Users.created_at.asc())
    query = query.limit(page_size).offset(offset)
    query_results = query.all()
    ##################
    response_param = {
      'page': param['page'],
      'page_size': page_size,
      'count_total': query_count,
      'page_total': page_total if page_total else 1
    }
    ##################
    response_data = []
    for x in query_results:
      response_data.append(UsersScheme(obj=x).serialize())
    ##################
    result = {
      'response': response_data,
      'paginator': response_param
    }
    return jsonify(result)