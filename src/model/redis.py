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
    """tipo_de_usuario = IntegerField()"""
    pontos_j1 = IntegerField(default=0)
    cliques_j1 = IntegerField(default=0)
    pontos_j2 = IntegerField(default=0)
    cliques_j2 = IntegerField(default=0)
    pontos_de_vida = IntegerField(default=0)
    pontos_de_moedas = IntegerField(default=0)
    desempenho_aluno_j1 = FloatField(default=0)
    desempenho_aluno_j2 = FloatField(default=0)
    aluns_list = []

    def gerar_matricula(self):
        """
        Usa um algoritmo aleatório para criar um numero de matricula
        :return: O numero de matricula
        """
        matricula = []
        for i in range(0, 5):
            matricula.append(randrange(1, 9))
        matricula = ''.join(str(x) for x in matricula)
        return matricula

    def create_usuario(self, nome, senha):
        """
        Método principal de criação do usuário

        :param nome: Nome do usuário , que vai servir como login
        :param senha: Senha que será usada pelo usuário para logar na sua conta
        :return: Um novo usuário para ser incluído no banco
        """

        self.create(usuario_nome=nome, usuario_senha=senha, matricula=self.gerar_matricula(), pontos_j1=0, pontos_j2=0)

    def read_usuario(self):
        """
        Cria uma entrada de dicionario contendo a id , o nome de usuário e a matricula de todos os usuarios registrados

        :return: O dicionario com os dados da id , nome e matricula dos usuários registrados
        """
        usuario_dic = {'id': [], 'matricula': [], 'usuario_nome': []}

        for aluno in self.query(order_by=self.usuario_nome):
            usuario_dic['id'].append(aluno.id)
            usuario_dic['matricula'].append(aluno.matricula)
            usuario_dic['usuario_nome'].append(aluno.usuario_nome)
            """usuario_dic['usuario_senha'].append(aluno.usuario_senha)
            usuario_dic['pontos_de_vida'].append(aluno.pontos_de_vida)
            usuario_dic['pontos_de_moedas'].append(aluno.pontos_de_moedas)"""

        return usuario_dic

    def pesquisa_usuario(self, usuario_nome):

        """
        pesquisa o aluno através da id, ou do nome do aluno

        :param : id , usuário_nome

        :return: O usuário pesquisado
        """
        usuario_dic = {'id': 0, 'matricula': '', 'nome': '', 'senha': '', 'pontos_j1': 0, 'pontos_j2': 0,
                       'pontos_de_vida': 0, 'pontos_de_moedas': 0, 'desempenho_aluno_j1': 0, 'desempenho_aluno_j2': 0}

        for pesquisa in DbUsuario.query(DbUsuario.usuario_nome == usuario_nome, order_by=DbUsuario.id):
            usuario_dic['id'] = pesquisa.id
            usuario_dic['matricula'] = pesquisa.matricula
            usuario_dic['nome'] = pesquisa.usuario_nome
            usuario_dic['senha'] = pesquisa.usuario_senha
            usuario_dic['pontos_j1'] = pesquisa.pontos_j1
            usuario_dic['pontos_j2'] = pesquisa.pontos_j2
            usuario_dic['pontos_de_moedas'] = pesquisa.pontos_de_moedas
            usuario_dic['pontos_de_vida'] = pesquisa.pontos_de_vida
            usuario_dic['desempenho_aluno_j1'] = pesquisa.desempenho_aluno_j1
            usuario_dic['desempenho_aluno_j2'] = pesquisa.desempenho_aluno_j2

        if usuario_dic['id'] == 0:
            return False
        else:
            return usuario_dic

    def aluno_delete(self, id):
        """
        deleta o aluno por id , futuramente por matricula e/ou nome
        :param id: o id do usuário no banco de dados
        :return: None
        """
        usuario = DbUsuario(id=id)
        usuario.delete()

    def pontos_jogo(self, usuario, jogo, pontos, clique):
        """
        Contabiliza os pontos ganhos pelo usuário ,os cliques totais e , através dos cliques totais, o desempenho do aluno no jogo ao qual ele esta jogando

        :param usuario: O jogador do jogo que esta nessa sessão de login :param jogo: Qual o jogo que o jogador
        decidiu jogar , se é j1 ou j2 :param pontos: O acrescenta 1 a cada acerto :param cliques: variavel auxiliar
        para acrescentar +1 para o numero total de cliques em cada jogo , independentemente de o jogador ter errado
        ou acertado no jogo
        :return: None
        """
        if pontos is None:
            pass
        elif jogo == 'j1':
            retorno = self.pesquisa_usuario(usuario)
            usuario = self.load(retorno['id'])
            usuario.pontos_j1 += pontos
            usuario.cliques_j1 += clique
            usuario.desempenho_aluno_j1 = (usuario.pontos_j1 / usuario.cliques_j1) * 100

            if usuario.pontos_j1 % 3 == 0:
                usuario.pontos_de_vida += 1

            if usuario.pontos_j1 % 5 == 0:
                usuario.pontos_de_moedas += 5
            usuario.save()
        elif jogo == 'j2':
            retorno = self.pesquisa_usuario(usuario)
            usuario = self.load(retorno['id'])
            usuario.pontos_j2 += pontos
            usuario.cliques_j2 += clique
            print('cliques j1:{}'.format(usuario.cliques_j2))
            usuario.desempenho_aluno_j2 = (usuario.pontos_j2 / usuario.cliques_j2) * 100
            print("acertou {} % ".format(usuario.desempenho_aluno_j2))
            if usuario.pontos_j2 % 3 == 0:
                usuario.pontos_de_vida += 1

            if usuario.pontos_j2 % 5 == 0:
                usuario.pontos_de_moedas += 5

            usuario.save()

    def coletar_alunos(self, aluno_id):
        return list(aluno_id)

    def alunos_in_turma(self, aluno_id, turma_id):
        retorno = turma_id
        turma = DbTurma.load(retorno['turma_id'])

        for aluno_id in aluno_id:
            turma.alunos_desta_turma.__setitem__(aluno_id)


class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)
    quem_criou = TextField()
    alunos_desta_turma = ListField()

    def create_turma(self, turma, login):
        """
        Cria uma turma e armazena quem criou a turma
        :param turma: O numero , ou o nome da turma
        :param login: O nome do login de quem criou a turma
        :return: Acrescenta a turma criada ao banco de dados
        """
        return self.create(turma_nome=turma, quem_criou=login)

    def read_turma(self):
        """
        Cadastra os dados de nome da turma e o nome de usuario de seu criador dentro de um dicionario

        :return: Uma entrada de dicionario com os dados da turma
        """

        turma_dic = {'id': [], 'nome': [], 'criador': []}

        for turma in self.query(order_by=self.id):
            turma_dic['id'].append(turma.id)
            turma_dic['nome'].append(turma.turma_nome)
            turma_dic['criador'].append(turma.quem_criou)

        return turma_dic

    def delete_turma(self, id):
        """
        Deleta as turmas por id , por enquanto nao implementado

        :param id: O id da turma
        :return: None
        """
        turma = DbTurma(id=id)
        turma.delete()
