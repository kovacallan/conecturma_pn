from walrus import *
db = Database()

class User(Model):
     __database__ = db
     name = TextField(primary_key=True)
     ponto = ListField()