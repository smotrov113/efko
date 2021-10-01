from src.lib.serialize import Mapper, Field

class PaginatorScheme(Mapper):
  __type__ = dict
  page_total = Field.Integer(required=False)
  count_total = Field.Integer(required=False)
  page = Field.Integer(required=False, default=1)
  page_size = Field.Integer(required=False, default=30)