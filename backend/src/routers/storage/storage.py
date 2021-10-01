from src.app import app
from src.lib.api import send_file

@app.route('/storage/doc', methods=['GET'])
def route_storage_doc():
  return send_file('../storage/doc.pdf', as_attachment=False)

@app.route('/storage/readme', methods=['GET'])
def route_storage_readme():
  return send_file('../storage/readme.md', as_attachment=False)