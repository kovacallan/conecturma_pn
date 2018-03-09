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

    def usuario_logado(self, id_usuario):
        usuario = self.load(id_usuario)
        return usuario

    def gerar_matricula(self):
        matricula = []
        for i in range(0, 5):
            matricula.append(randrange(1, 9))
        matricula = ''.join(str(x) for x in matricula)
        return matricula

    def create_usuario(self, nome, senha):
        self.create(usuario_nome=nome, usuario_senha=senha, matricula=self.gerar_matricula())

    def read_usuario(self):
        """
        cria uma entrada de dicionario para cada usuário e senha
        :return: o dicionario
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

        :return: o usuário pesquisado
        """
        usuario = {}
        for pesquisa in DbUsuario.query(DbUsuario.usuario_nome == usuario_nome, order_by=DbUsuario.id):
            usuario = pesquisa

        if usuario == '' and usuario == None:
            return False
        else:
            return usuario

    def aluno_delete(self, id):
        """
        deleta o aluno por id , futuramente por matricula e/ou nome
        :param id:
        :return: void
        """
        usuario = DbUsuario(id=id)
        usuario.delete()

    def pontos_jogo(self, usuario, jogo, pontos, clique):
        """
        Contabiliza os pontos ganhos pelo usuário ,os cliques totais e , através dos cliques totais, o desempenho do aluno no jogo ao qual ele esta jogando

        :param usuario: O jogador do jogo que esta nessa sessão de login
        :param jogo: Qual o jogo que o jogador decidiu jogar , se é j1 ou j2
        :param pontos: O acrescenta 1 a cada acerto
        :param cliques_totais: contabiliza a quantidade de cliques totais feitos , independente se o usuario acertar ou errar a resposta
        :return: None
        """
        if pontos is None:
            pass
        elif jogo == 'j1':
            retorno = self.pesquisa_usuario(usuario)
            usuario = self.load(retorno.id)
            usuario.pontos_j1 += pontos
            usuario.cliques_j1 += clique
            print('cliques j1:{}'.format(usuario.cliques_j1))
            usuario.desempenho_aluno_j1 = (usuario.pontos_j1 / usuario.cliques_j1) * 100
            print("acertou {} % ".format(usuario.desempenho_aluno_j1))

            if usuario.pontos_j1 % 3 == 0:
                usuario.pontos_de_vida += 1

            if usuario.pontos_j1 % 5 == 0:
                usuario.pontos_de_moedas += 5
            usuario.save()
        elif jogo == 'j2':
            retorno = self.pesquisa_usuario(usuario)
            usuario = self.load(retorno.id)
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

    def comprar_item(self, id_usuario, id_item):
        """
        Metodo para comprar o item
        :param id_usuario: o id do usuario logado na plataforma
        :param id_item: O id do item que vai ser comprado
        :return:
        """
        item = DbLoja()
        usuario = DbUsuario.load(id_usuario)
        preco = item.pesquisar_item(id_item).preco_item

        if usuario.pontos_de_moedas < preco:
            print("você não tem moeda")
        else:
            usuario.pontos_de_moedas -= preco
            usuario.items_comprado.append(id_item)
            usuario.save()

    def ver_itens_comprados(self, id_usuario):
        """
        Metodo para mostrar
        :param id_usuario:
        :return:
        """
        usuario = self.load(id_usuario)
        itens = [int(''.join(str(x.decode('utf-8')))) for x in usuario.items_comprado]
        return itens

    def equipar_item(self, id_usuario, itens):
        usuario = self.load(id_usuario)

        if itens.tipo_item == 1:
            usuario.cor = itens.id
        else:
            if itens.tipo_item == 2:
                usuario.rosto = itens.id
            else:
                if itens.tipo_item == 3:
                    usuario.acessorio = itens.id
                else:
                    if itens.tipo_item == 4:
                        usuario.corpo = itens.id
        usuario.save()

    def avatar(self, id):
        usuario = self.usuario_logado(id)
        return dict(cor=usuario.cor, rosto=usuario.rosto, acessorio=usuario.acessorio, corpo=usuario.corpo)



"""Verificar de onde vem ... pq erro """


class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)
    quem_criou = TextField()

    def create_turma(self, turma, login):
        """
        cria a turma
        :param turma:
        :return: uma entrada no banco de dados para a turma criada
        """
        return self.create(turma_nome=turma, quem_criou=login)

    def read_turma(self):
        """
        cadastra todos os dados de uma turma dentro de um dicionario

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
        deleta as turmas por id , por enquanto nao efetivado

        :param id:
        :return: None
        """
        turma = DbTurma(id=id)
        turma.delete()


class DbLoja(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField()
    tipo= IntegerField(default=0)
    preco = IntegerField(default=0)

    def create_item(self, nome, tipo, preco):
        """
            Cria o item no banco de dados
        :param nome:Nome do item
        :param tipo:Se ele é cor,rosto,acessorio,corpo
        :param preco: é o preço do item
        :return:
        """
        self.create(nome=nome, tipo=tipo, preco=preco)

    def Read_item(self):
        """
            Leitura dos itens cadastrados na plataforma
        :return: Os itens cadastrados
        """
        itens = []
        for item in self.query(order_by=self.id):
            itens.append(dict(id = item.id, nome = item.nome, tipo = item.tipo, preco = item.preco))

        if itens != '' and itens != None and itens != 0:
            return itens
        else:
            return False

    def pesquisar_item(self, id):
        """
        Pesquisa por item especifico
        :param id:Id do item
        :return:O objeto que corresponde ao Id
        """

        item = None
        for pesquisa in DbLoja.query(DbLoja.id == id, order_by=DbUsuario.id):
            item = pesquisa

        if item == '' and item == None:
            return False
        else:
            return item

    def item_delete(self, id):
        """
        deleta o item por id
        :param id:
        :return: void
        """
        loja = DbLoja(id=id)
        loja.delete()

    def ja_possui_item(self, usuario_logado):
        """
        Envia se o usuario já comprou o item
        :param usuario_logado: Id do usuario
        :return: Lista de itens que o usuario não tem
        """
        usuario = DbUsuario()
        itens_usuario = [x.decode('utf-8') for x in
                         usuario.pesquisa_usuario(usuario_nome=usuario_logado).items_comprado]
        itens = [str(y.id) for y in self.Read_item()]
        lista_teste = [z for z in itens if z not in itens_usuario]

        return lista_teste
