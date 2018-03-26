from walrus import *
from random import randrange
from src.model.loja_model import *
from src.model.turma_model import *

db = Database(host='localhost', port=6379, db=0)

"""A classe DbAluno será usada como Usuário genérico no spike que é , por enquanto, um aluno onipotente"""

class DbAluno(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    matricula = TextField()
    nome = TextField(fts=True, index=True)
    senha = TextField()
    """tipo_de_usuario = IntegerField()"""
    items_comprado = ListField()
    cor = IntegerField(default=0)
    rosto = IntegerField(default=0)
    acessorio = IntegerField(default=0)
    corpo = IntegerField(default=0)
    pontos_j1 = IntegerField(default=0)
    cliques_j1 = IntegerField(default=0)
    pontos_j2 = IntegerField(default=0)
    cliques_j2 = IntegerField(default=0)
    pontos_de_vida = IntegerField(default=0)
    pontos_de_moedas = IntegerField(default=0)
    desempenho_aluno_j1 = FloatField(default=0)
    desempenho_aluno_j2 = FloatField(default=0)
    turma_do_aluno = TextField(fts=True, index=True)

    def usuario_logado(self, id_usuario):
        """
        Faz o login do usuário

        :param id_usuario: O id do usuario
        :return: usuario logado
        """
        usuario = self.load(id_usuario)
        return usuario

    def gerar_matricula(self):
        """
        Usa um algoritmo aleatório para criar um numero de matricula de 5 números

        :return: O numero da matricula do aluno
        """
        matricula = []
        for i in range(0, 5):
            matricula.append(randrange(1, 9))
        matricula = ''.join(str(x) for x in matricula)
        return matricula

    def validar_senha_vazia(self, senha):
        if senha == "" or senha == None:
            return True
        else:
            return False

    def create_aluno(self, nome, senha):
        """
        Método principal de criação do usuário no banco de dados

        :param nome: Nome do usuário , que vai servir como login
        :param senha: Senha que será usada pelo usuário para logar na sua conta
        :return: Um novo usuário para ser incluído no banco
        """

        if not self.validar_senha_vazia(senha):
            matricula = self.gerar_matricula()
            self.create(nome=nome, senha=senha, matricula=matricula)
            return True
        else:
            return TypeError("Não foi possivel salvar o Usuário")

    def update_aluno(self, id, nome, senha):
        """
            Metodo principal para updade de
        :param id:
        :param nome:
        :param senha:
        :return:
        """
        if not self.validar_senha_vazia(senha):
            aluno = self.load(id)
            aluno.nome = nome
            aluno.senha = senha
            aluno.save()
            return True
        else:
            return False

    def read_usuario(self):
        """
        Cria uma entrada de dicionario vazia e adiciona os campos de id , matricula e nome do usuario/login

        :return: O dicionario com os dados da id , nome e matricula dos usuários registrados
        """
        alunos = []

        for aluno in self.query(order_by=self.nome):
            alunos.append(dict(id=aluno.id, matricula=aluno.matricula, usuario_nome=aluno.nome,
                               turma_do_aluno=aluno.turma_do_aluno))
        return alunos

    def pesquisa_usuario(self, usuario_nome):

        """
        pesquisa o aluno através da id, ou do nome do aluno , ainda nao implentado

        :param : id , usuário_nome

        :return: O usuário pesquisado
        """

        usuario = None
        for pesquisa in DbAluno.query(DbAluno.nome == usuario_nome, order_by=DbAluno.id):
            usuario = pesquisa

        return usuario

    def aluno_delete(self, deletar_ids):
        """
        deleta o(s) aluno(s) percorrendo a lista de ids de usuários selecionados

        :param deletar_ids: Uma lista dos usuários a serem deletados
        :return: None
        """
        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def pontos_jogo(self, usuario, jogo, pontos):
        """
        Contabiliza os pontos ganhos pelo usuário ,os cliques totais e , através dos cliques totais,
        o desempenho do aluno no jogo ao qual ele esta jogando

        :param usuario: O jogador do jogo que esta nessa sessão de login
        :param jogo: Qual o jogo que o jogador
        decidiu jogar , se é j1 ou j2
        :param pontos: O acrescenta 1 a cada acerto
        :param cliques: variavel auxiliar
        para acrescentar +1 para o numero total de cliques em cada jogo , independentemente de o jogador ter errado
        ou acertado no jogo
        :return: None
        """
        retorno = self.pesquisa_usuario(usuario)

        if pontos == None:
            return False
        elif jogo == 'j1':
            if self.jogo_j1(retorno.id, pontos):
                return True
            else:
                return False
        elif jogo == 'j2':
            if self.jogo_j2(retorno.id, pontos):
                return True
            else:
                return False

    def jogo_j1(self, id, pontos):
        usuario = self.load(id)
        usuario.pontos_j1 += pontos
        usuario.cliques_j1 += 1
        self.desempenho_jogoj1(usuario)
        if usuario.pontos_j1 % 3 == 0 and pontos == 1:
            self.mais_vidas(usuario)
        if usuario.pontos_j1 % 5 == 0 and pontos == 1:
            self.mais_dinheiro(usuario)
        usuario.save()
        return True

    def jogo_j2(self, id, pontos):
        usuario = self.load(id)
        usuario.pontos_j2 += pontos
        usuario.cliques_j2 += 1
        self.desempenho_jogoj2(usuario)
        if usuario.pontos_j2 % 3 == 0 and pontos == 1:
            usuario.mais_vidas(usuario)

        if usuario.pontos_j2 % 5 == 0 and pontos == 1:
            usuario.mais_dinheiro(usuario)
        usuario.save()
        return True

    def mais_dinheiro(self, usuario):
        usuario.pontos_de_moedas += 5

    def mais_vidas(self, usuario):
        usuario.pontos_de_vida += 1

    def desempenho_jogoj1(self, usuario):
        usuario.desempenho_aluno_j1 = (usuario.pontos_j1 / usuario.cliques_j1) * 100

    def desempenho_jogoj2(self, usuario):
        usuario.desempenho_aluno_j2 = (usuario.pontos_j2 / usuario.cliques_j2) * 100

    def alunos_in_turma(self, escolha, turma_add):
        """
        Percorre uma lista de alunos selecionados para colocar o id da turma a qual pertence em cada aluno
        turma é um atributo de aluno
        :param escolha: lista de ids de alunos que terão o parâmetro do id da turma acrescentado ao objeto
        :param turma_add: o id da turma escolhida para ser acrescida aos alunos
        :return: None
        """
        res = DbTurma.load(turma_add)
        turma_add = res.turma_nome
        for escolha in escolha:
            usuario = self.load(escolha)
            usuario.turma_do_aluno = turma_add
            usuario.save()

    def comprar_item(self, id_usuario, id_item):
        """
        Método para o aluno comprar items

        :param id_usuario: o id do usuário logado na plataforma
        :param id_item: O id do item que vai ser comprado
        :return:
        """
        item = DbLoja()
        usuario = DbAluno.load(id_usuario)
        preco = item.pesquisar_item(id_item).preco

        if usuario.pontos_de_moedas < preco:
            print("você não tem moeda")
        else:
            usuario.pontos_de_moedas -= preco
            usuario.items_comprado.append(id_item)
            usuario.save()

    def ver_itens_comprados(self, id_usuario):
        """
        Mostra os itens cujos os quais usuário tem posse
        :param id_usuario: O usuário que tem os itens
        :return: A lista dos itens
        """
        usuario = self.load(id_usuario)
        itens = [int(''.join(str(x.decode('utf-8')))) for x in usuario.items_comprado]
        return itens

    def equipar_item(self, id_usuario, itens):
        """
        Equipa o item escolhido pelo usuario , através de botões
        :param id_usuario: O usuario, no caso o atual , que vai equipar os itens
        :param itens:O item que vai ser equipado
        :return: O avatar usando o item(mostrado na pagina do menu)
        """
        usuario = self.load(id_usuario)

        if itens.tipo == 1:
            usuario.cor = itens.id
        else:
            if itens.tipo == 2:
                usuario.rosto = itens.id
            else:
                if itens.tipo == 3:
                    usuario.acessorio = itens.id
                else:
                    if itens.tipo == 4:
                        usuario.corpo = itens.id
        usuario.save()

    def avatar(self, id):
        """
        O avatar no qual os itens são equipados

        :param id: id do usuario dono do avatar , no caso o atual
        :return: Um dicionario com os atributos do avatar
        """
        usuario = self.usuario_logado(id)
        return dict(cor=usuario.cor, rosto=usuario.rosto, acessorio=usuario.acessorio, corpo=usuario.corpo)
