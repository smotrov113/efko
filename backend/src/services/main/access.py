from src.app import db
from src.lib.api import jsonify, abort

from src.model import Users

def user_authorization(request):
  ############
  certificate = request.headers.get('Certificate')
  ############
  if not request.headers.get('Certificate'):
    abort(403, 'Not Authorized')
  ############
  query = db.session.query(Users)
  query = query.filter(Users.certificate == certificate)
  query_result = query.all()
  ############
  if len(query_result) == 0:
    abort(403, 'Not Authorized')
  elif len(query_result) > 0:    
    return {
      'user': query_result[0],
    }
  ############

def username_authorization(username):
  ############
  if not username:
    abort(403, 'Not Authorized')
  ############
  query = db.session.query(Users)
  query = query.filter(
    Users.last_name +
    db.func.substr(Users.first_name, 1, 1) +
    db.func.substr(Users.middle_name, 1, 1) == username
  )
  query_result = query.all()
  ############
  if len(query_result) == 0:
    abort(403, 'Not Authorized')
  elif len(query_result) > 0:
    return {
      'user': query_result[0],
    }
  ############