from src.app import app
from src.lib.api import jsonify

@app.route('/ping', methods=['GET'])
def route_ping():
  return jsonify({'status': True})