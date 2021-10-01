from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
from src.lib.sqlalchemy import SQLAlchemyUUID
from src.lib.api import flask, jsonify, make_response

from src.config import Configuration
from sqlalchemy_searchable import make_searchable

app = flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.config.from_object(Configuration)
cors = CORS(app, resources={r'/*': {'origins': '*'}})

####### ERROR JSON - OPEN ######
@app.errorhandler(Exception)
def error_handler(e):
  code = 500
  if isinstance(e, HTTPException):
    code = e.code
  try:
    return jsonify(error=str(e.description)), code
  except:
    return jsonify(error=str(e)), code

@app.after_request
def after_request(response):
  response.headers['Server'] = 'efko.ru'
  return response

@app.route('/favicon.ico') 
def route_favicon():
  return make_response(jsonify(None), 200)
####### ERROR JSON - CLOSE #######

db = SQLAlchemy(app)
db = SQLAlchemyUUID(db)
#########################
make_searchable(db.metadata)
db.configure_mappers()
#########################