from src.app import db
from src.model import Users

from sqlalchemy_searchable import make_searchable

make_searchable(db.metadata)
db.configure_mappers()

db.create_all()
param = {'search': 'смотров'}
######################################################
ts_search = Users.ts_last_name
######################################################
query = db.session.query(Users)
query = query.filter(ts_search.op('@@')(db.func.parse_websearch(param['search'])))
query_results = query.all()
######################################################

for x in query_results:
  print(x.username, x.first_name)