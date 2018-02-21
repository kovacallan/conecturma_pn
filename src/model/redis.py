from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbAluno(Model):
    __database__ = db
    id = TextField(primary_key=True)
    nome = TextField()
    serie = TextField()


class Turma(Model):
    __database__ = db
    id = TextField(primary_key=True)
    turma_nome = TextField()
