from walrus import *
from random import randrange

db = Database(host='localhost', port=6379, db=0)

""" class DbAluno será usada como Usuario generico no spike"""


class DbUsuario(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    matricula = TextField(fts=True, index=True)
    usuario_nome = TextField(fts=True, index=True)
    usuario_senha = TextField()
    tipo_de_usuario = IntegerField()
    pontos_de_vida = IntegerField()
    pontos_de_moedas = IntegerField()

    def gerar_matricula(self):
        matricula = []
        for i in range(0, 5):
            matricula.append(randrange(1, 9))
        matricula = ''.join(str(x) for x in matricula)

    def create_usuario(self, nome, senha):

        self.create(usuario_nome=nome, usuario_senha=senha, matricula=self.gerar_matricula())

    def read_usuario(self):

        usuario_dic = {'id': [], 'matricula': [], 'usuario_nome': [], 'usuario_senha': []}

        for aluno in self.query(order_by=self.usuario_nome):
            usuario_dic['id'].append(aluno.id)
            usuario_dic['matricula'].append(aluno.matricula)
            usuario_dic['usuario_nome'].append(aluno.usuario_nome)
            usuario_dic['usuario_senha'].append(aluno.usuario_senha)
        return usuario_dic

    def pesquisa_usuario(self, usuario_nome):
        usuario_dic = {'id': 0, 'nome': '', 'senha': ''}

        for pesquisa in DbUsuario.query(DbUsuario.usuario_nome == self.usuario_nome, order_by=DbUsuario.id):
            usuario_dic['id'] = pesquisa.id
            usuario_dic['nome'] = pesquisa.usuario_nome
            usuario_dic['senha'] = pesquisa.usuario_senha

        if usuario_dic['id'] == 0:
            return False
        else:
            return usuario_dic

    def aluno_delete(self, id):
        usuario = DbUsuario(id=id)
        usuario.delete()


"""verificar de onde vem ... pq erro """


class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)

    def create_turma(self, turma):
        return self.create(turma_nome=turma)

    def read_turma(self):
        return self.query(order_by=self.id)

    def delete_turma(self, id):
        turma = DbTurma(id=id)
        turma.delete()
