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
        return matricula

    def create_usuario(self, nome, senha):
        """
        cria um usuario
        :param nome: entra com o nome(e usuario) que sera utilizado
        :param senha: cria a senha para o login
        :return:uma entrada no banco de dados para o novo usuario e sua senha
        """
        self.create(usuario_nome=nome, usuario_senha=senha)

    def read_usuario(self):
        """
        cria uma entrada de dicionario para cada usuario e senha
        :return: o dicionario
        """
        usuario_dic = {'id': [], 'matricula': [], 'usuario_nome': [], 'usuario_senha': []}

        for aluno in self.query(order_by=self.usuario_nome):
            usuario_dic['id'].append(aluno.id)
            usuario_dic['matricula'].append(aluno.matricula)
            usuario_dic['usuario_nome'].append(aluno.usuario_nome)
            usuario_dic['usuario_senha'].append(aluno.usuario_senha)
        return usuario_dic

    def pesquisa_aluno(self, usuario_nome):

        """
        pesquisa o aluno atravez da id, ou do nome do aluno
        :param id , usuario_nome :
        :return: o usuario pesquisado
        """
        usuario_dic = {'id': 0, 'matricula':'', 'nome': '', 'senha': ''}

        for pesquisa in DbUsuario.query(DbUsuario.usuario_nome == usuario_nome, order_by=DbUsuario.id):
            usuario_dic['id'] = pesquisa.id
            usuario_dic['matricula'] = pesquisa.matricula
            usuario_dic['nome'] = pesquisa.usuario_nome
            usuario_dic['senha'] = pesquisa.usuario_senha

        if usuario_dic['id'] == 0:
            return False
        else:
            print('entrei aqui')
            return usuario_dic

    def aluno_delete(self, id):
        """
        deleta o aluno por id , futuramente por matricula e/ou nome
        :param id:
        :return: void
        """
        usuario = DbUsuario(id=id)
        usuario.delete()

"""verificar de onde vem ... pq erro """

class DbTurma(Model):

    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)

    def create_turma(self, turma):
        """
        cria a turma
        :param turma:
        :return: uma entrada no banco de dados para a turma criada
        """
        return self.create(turma_nome=turma)

    def read_turma(self):
        """
        mostra a turma
        :return: as turmas cadastradas em ordem de id
        """
        return self.query(order_by=self.id)

    def delete_turma(self, id):
        turma = DbTurma(id=id)
        turma.delete()
