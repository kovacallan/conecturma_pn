from walrus import *
from random import randrange

db = Database(host='localhost', port=6379, db=0)

""" class DbUsuário será usada como Usuário genérico no spike"""


class DbUsuario(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    matricula = TextField()
    usuario_nome = TextField(fts=True, index=True)
    usuario_senha = TextField()
    tipo_de_usuario = IntegerField()
    pontos_j1 = IntegerField()
    total_cliques_j1 = IntegerField()
    pontos_j2 = IntegerField()
    pontos_de_vida = IntegerField()
    pontos_de_moedas = IntegerField()

    def gerar_matricula(self):
        matricula = []
        for i in range(0, 5):
            matricula.append(randrange(1, 9))
        matricula = ''.join(str(x) for x in matricula)
        return matricula

    def create_usuario(self, nome, senha, pontos_j1=0, pontos_j2=0, pontos_de_vida=0, pontos_de_moedas=0):

        self.create(usuario_nome=nome, usuario_senha=senha, matricula=self.gerar_matricula(), pontos_j1=0, pontos_j2=0)

    def read_usuario(self):
        """
        cria uma entrada de dicionario para cada usuário e senha
        :return: o dicionario
        """
        usuario_dic = {'id': [], 'matricula': [], 'usuario_nome': [], 'usuario_senha': [], 'pontos_de_vida': [],
                       'pontos_de_moedas': []}

        for aluno in self.query(order_by=self.usuario_nome):
            usuario_dic['id'].append(aluno.id)
            usuario_dic['matricula'].append(aluno.matricula)
            usuario_dic['usuario_nome'].append(aluno.usuario_nome)
            usuario_dic['usuario_senha'].append(aluno.usuario_senha)
            usuario_dic['pontos_de_vida'].append(aluno.pontos_de_vida)
            usuario_dic['pontos_de_moedas'].append(aluno.pontos_de_moedas)
        return usuario_dic

    def pesquisa_usuario(self, usuario_nome):

        """
        pesquisa o aluno através da id, ou do nome do aluno
        :param : id , usuário_nome
        :return: o usuário pesquisado
        """
        usuario_dic = {'id': 0, 'matricula': '', 'nome': '', 'senha': '', 'pontos_j1': 0, 'pontos_j2': 0,
                       'pontos_de_vida': 0, 'pontos_de_moedas': 0}

        for pesquisa in DbUsuario.query(DbUsuario.usuario_nome == usuario_nome, order_by=DbUsuario.id):
            usuario_dic['id'] = pesquisa.id
            usuario_dic['matricula'] = pesquisa.matricula
            usuario_dic['nome'] = pesquisa.usuario_nome
            usuario_dic['senha'] = pesquisa.usuario_senha
            usuario_dic['pontos_j1'] = pesquisa.pontos_j1
            usuario_dic['pontos_j2'] = pesquisa.pontos_j2
            usuario_dic['pontos_de_moedas'] = pesquisa.pontos_de_moedas
            usuario_dic['pontos_de_vida'] = pesquisa.pontos_de_vida

        if usuario_dic['id'] == 0:
            return False
        else:
            return usuario_dic

    def aluno_delete(self, id):
        """
        deleta o aluno por id , futuramente por matricula e/ou nome
        :param id:
        :return: void
        """
        usuario = DbUsuario(id=id)
        usuario.delete()

    def pontos_jogo(self, usuario, jogo, pontos):
        if pontos == None or pontos == 0:
            pass
        elif jogo == 'j1':
            retorno = self.pesquisa_usuario(usuario)
            usuario = self.load(retorno['id'])
            usuario.pontos_j1 += pontos
            if usuario.pontos_j1 % 3 == 0:
                usuario.pontos_de_vida += 1

            if usuario.pontos_j1 % 5 == 0:
                usuario.pontos_de_moedas += 5

            print('vidas:{}   moedas : {}'.format(usuario.pontos_de_vida, usuario.pontos_de_moedas))

            usuario.save()
        elif jogo == 'j2':
            retorno = self.pesquisa_usuario(usuario)
            usuario = self.load(retorno['id'])
            usuario.pontos_j2 += pontos
            if pontos % 3 == 0:
                usuario.pontos_de_vida += 1

            if pontos % 5 == 0:
                usuario.pontos_de_moedas += 5
            print('vidas:{}   moedas : {}'.format(usuario.pontos_de_vida, usuario.pontos_de_moedas))
            usuario.save()


"""Verificar de onde vem ... pq erro """


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
