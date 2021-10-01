import random, string

def create_serial(size=25, chars=string.digits):
  return ''.join(random.choice(chars) for _ in range(size))

def create_certificate(size=50, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
  return ''.join(random.choice(chars) for _ in range(size))

def error_message(type, key):
  if type == 1:
    return 'Invalid parameter ['+key+']'
  elif type == 2:
    return 'Duplicate parameter ['+key+']'