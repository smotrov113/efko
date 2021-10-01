
def config(value):
  return Configuration.__dict__[value]

def get_string_db():
  db = {'user': 'postgres', 'password': 'f7CiMYsP', 'database': 'efko', 'host': 'localhost', 'port': '5432'}
  return 'postgresql://%(user)s:%(password)s@%(host)s:%(port)s/%(database)s' % db

class Configuration(object):
  ################################
  SEND_FILE_MAX_AGE_DEFAULT = 0
  SQLALCHEMY_TRACK_MODIFICATIONS = True
  SQLALCHEMY_DATABASE_URI = get_string_db()
  ################################