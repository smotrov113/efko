from src.app import app, db
from flask_migrate import Migrate

from src.model import *

migrate = Migrate(app, db)