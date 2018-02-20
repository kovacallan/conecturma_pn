from walrus import *

db = Database(host = 'localhost', port = 6379, db = 0)

class User(Model):
     __database__ = db
     name = TextField(primary_key=True)


class Turma(Model):
     __database__ = db
     id = TextField(primary_key=True)
     turma_nome = TextField()
