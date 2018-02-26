from walrus import *

db = Database(host = 'localhost', port = 6379, db = 0)

"""class DbAluno será usada como Usuario generico no spike"""
class DbAluno(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    aluno_nome = TextField(fts = True, index = True)
    senha_aluno = TextField()
    #pontos_aluno

    def create_aluno(self, nome, senha):
        """
        cria aluno
        :param nome: nome do aluno e do usuario aluno
        :param senha:
        :return:
        """
        return self.create(aluno_nome = nome, senha_aluno = senha)

    def pesquisa_aluno(self, nome):
         aluno_dic = {'id': 0, 'nome': '', 'senha': ''}
         for pesquisa in DbAluno.query(DbAluno.aluno_nome == nome, order_by=DbAluno.id):
              aluno_dic['id'] = pesquisa.id
              aluno_dic['nome'] = pesquisa.aluno_nome
              aluno_dic['senha']= pesquisa.senha_aluno
         if aluno_dic['id'] == 0:
              return False
         else:
              return aluno_dic

     def logar_aluno(self, nome,senha):
         query = self.query()

     def aluno_delete(self, nome):
         self.query_delete(self.aluno_nome == nome)
