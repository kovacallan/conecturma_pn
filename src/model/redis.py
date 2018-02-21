from walrus import *

db = Database(host = 'localhost', port = 6379, db = 0)

class DbAluno(Model):
     __database__ = db
     id = TextField(primary_key=True)
     serie = TextField()




class DbTurma(Model):
     __database__ = db
     id = TextField(primary_key=True)
     turma_nome = TextField(index = True)

     def create_turma(self, id, turma):
          return self.create(id=id, turma_nome=turma)

     def read_turma(self):
          return self.all()