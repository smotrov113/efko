from src.app import app, db
from src.lib.api import abort, jsonify, request

from src.lib.serialize import Mapper, Field
from src.services.main.mapping import param_marshal
from src.services.main.access import user_authorization

from datetime import date
from src.model import Vacations
from src.scheme import VacationsScheme

@app.route('/vacations/<request_type>', methods=['POST'])
def route_vacations_record(request_type=None):
  if request_type == 'create':
    return vacations_record(1)
  elif request_type == 'update':
    return vacations_record(2)
  elif request_type == 'delete':
    return vacations_record(3)
  else:
    abort(404)

def vacations_record(request_type):
  #################
  current_user = user_authorization(request)['user']
  #################
  param = param_marshal(request, VacationsScheme)
  ##################
  if request_type == 3:
    abort(500)
  elif request_type == 1 or request_type == 2:
    rec_doc = record_doc(request_type, param, current_user)
    db.session.commit()
  ################
  return VacationsScheme(obj=rec_doc).serialize()

def record_doc(request_type, param, current_user):
  ################
  if param.date_end:
    param.date_end = param.date_end.date()
  if param.date_start:
    param.date_start = param.date_start.date()
  ################
  date_min = date(param.year.year, 1, 1)
  date_max = date(param.year.year, 12, 31)
  ################
  if param.date_end and param.date_start:
    if param.date_end < date_min:
      abort(500)
    if param.date_start > date_max:
      abort(500)
    if param.date_end < param.date_start:
      abort(500)
  ################
  if not current_user.is_director:
    if param.is_agreed == True:
      abort(500)
    if current_user.id != param.user.id:
      abort(500)
  ################
  param.year = date(param.year.year, 1, 1)
  ################
  record = Vacations(
    id = param.id,
    year = param.year,
    user_id = param.user.id,
    date_end = param.date_end,
    is_agreed = param.is_agreed,
    date_start = param.date_start,
  )
  ################
  record = db.session.merge(record)
  ################
  db.session.flush()
  db.session.refresh(record)
  ################
  return record