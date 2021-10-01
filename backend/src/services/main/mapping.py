from flask import abort, request
from src.lib.serialize import MappingInvalid

def nullify(container):
 for key in container:
  if type(key) == list:
    nullify(key)
  elif type(key) == dict:
    nullify(key)
  elif type(container[key]) == dict or type(container[key]) == list:
    nullify(container[key])
  elif container[key] == '':
    container[key] = None

def request_json(request):
  if request.get_json(silent=True):
    nullify(request.json)
    return request.json
  elif not request.get_json(silent=True):
    return {}

def param_marshal(data, scheme, role=None):
  if data == request:
    data = request_json(data)
  ##################
  try:
    if not role:
      result = scheme(data=data).marshal()
    elif role:
      result = scheme(data=data).marshal(role=role)
  except MappingInvalid as e:
    abort(400, e.errors)
  return result