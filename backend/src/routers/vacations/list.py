from src.app import app, db
from datetime import datetime
from src.lib.api import abort, jsonify, request

from math import ceil
from src.lib.serialize import Mapper, Field

from src.model import Vacations, Users
from src.scheme import VacationsScheme, UsersScheme

class RouteVacationsListScheme(Mapper):
  __type__ = dict
  search = Field.String(required=False)
  page = Field.Integer(required=True, min=1, default=1)
  year = Field.Integer(required=True, default=datetime.now().year)

@app.route('/vacations/list', methods=['GET'])
def route_vacations_list():
  ##################
  page_size = 50
  data = request.args.to_dict()
  param = RouteVacationsListScheme(data=data).marshal()
  ##################
  query = db.session.query(Users, Vacations)
  query = query.outerjoin(Vacations, db.and_(
    Users.id == Vacations.user_id,
    db.extract('year', Vacations.year) == param['year']
  ))

  if param['search'] and len(param['search']) >= 3:
    ts_search = Users.ts_last_name | Users.ts_first_name 
    ts_search = ts_search | Users.ts_middle_name | Users.position
    query = query.filter(ts_search.op('@@')(db.func.parse_websearch(param['search'])))
  
  offset = page_size * (param['page'] - 1)
  query_count = query.count() if query else 0
  page_total = ceil( query_count / page_size )

  query = query.order_by(Users.last_name.asc())
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
    record = VacationsScheme(obj=x[1]).serialize() if x[1] else {}
    record['user'] = UsersScheme(obj=x[0]).serialize() if x[0] else None
    response_data.append(record)
  ##################
  result = {
    'response': response_data,
    'paginator': response_param
  }
  return jsonify(result)