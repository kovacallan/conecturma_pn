from walrus import *

db = Database(host = 'localhost', port = 6379, db = 0)

# class DbAluno será usada como Usuario generico no spike
class DbAluno(Model):
     __database__ = db
     id = AutoIncrementField(primary_key=True)
     aluno_nome = TextField()
     senha_aluno = TextField()

     def create_aluno(self, nome, senha):
         return self.create(aluno_nome = nome, senha_aluno = senha)


     #def _delete(self, instance):
     #    self._get_container(instance).clear()


class DbTurma(Model):
     __database__ = db
     id = AutoIncrementField(primary_key=True)
     turma_nome = TextField(index = True)

     def create_turma(self,turma):
          return self.create(turma_nome=turma)

     def read_turma(self):
          return self.query(order_by=self.id)

