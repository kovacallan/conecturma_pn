from walrus import *

db = Database(host = 'localhost', port = 6379, db = 0)

# class DbAluno será usada como Usuario generico no spike
class DbAluno(Model):
     __database__ = db
     id = AutoIncrementField(primary_key=True)
     aluno_nome = TextField(fts = True, index = True)
     senha_aluno = TextField()

     def create_aluno(self, nome, senha):
         return self.create(aluno_nome = nome, senha_aluno = senha)

     def pesquisa_aluno(self, nome):
          aluno_dic = {'id': [], 'nome': [], 'senha': []}
          for pesquisa in DbAluno.query(DbAluno.aluno_nome == nome, order_by=DbAluno.id):
               aluno_dic['id'].append(pesquisa.id)
               aluno_dic['nome'].append(pesquisa.aluno_nome)
               aluno_dic['senha'].append(pesquisa.senha_aluno)
          return aluno_dic

     def logar_aluno(self, nome,senha):
          query = self.query()

class DbTurma(Model):
     __database__ = db
     id = AutoIncrementField(primary_key=True)
     turma_nome = TextField(index = True)

     def create_turma(self,turma):
          return self.create(turma_nome=turma)

     def read_turma(self):
          return self.query(order_by=self.id)