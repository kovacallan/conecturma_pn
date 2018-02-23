from walrus import *

db = Database(host = 'localhost', port = 6379, db = 0)

class DbTurma(Model):
     __database__ = db
     id = AutoIncrementField(primary_key=True)
     turma_nome = TextField(index = True)

     def create_turma(self,turma):
          return self.create(turma_nome=turma)

     def read_turma(self):
          return self.query(order_by=self.id)