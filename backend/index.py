from src.app import app
from tornado.ioloop import IOLoop
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.web import Application, FallbackHandler

from src.router import *

if __name__ == '__main__':
  # app.run(host='0.0.0.0', port=3030, debug=True)
  
  wsgi_app = WSGIContainer(app)
  headers = [(r'.*', FallbackHandler, dict(fallback=wsgi_app))]
  http_server = HTTPServer(Application(headers, debug=True))
  http_server.listen(3030, address='0.0.0.0')
  IOLoop.instance().start()