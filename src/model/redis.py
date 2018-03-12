from walrus import *
from random import randrange

db = Database(host='localhost', port=6379, db=0)

""" class DbAluno será usada como Usuário genérico no spike"""


class DbAluno(Model):
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
    turma_do_aluno = TextField()

    def usuario_logado(self, id_usuario):
        usuario = self.load(id_usuario)
        return usuario

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

        self.create(usuario_nome=nome, usuario_senha=senha, matricula=self.gerar_matricula())

    def read_usuario(self):
        """
        Cria uma entrada de dicionario contendo a id , o nome de usuário e a matricula de todos os usuarios registrados

        :return: O dicionario com os dados da id , nome e matricula dos usuários registrados
        """
        usuario_dic = []

        for aluno in self.query(order_by=self.usuario_nome):
            usuario_dic.append(dict(id=aluno.id, matricula=aluno.matricula, usuario_nome=aluno.usuario_nome))
        return usuario_dic

    def pesquisa_usuario(self, usuario_nome):

        """
        pesquisa o aluno através da id, ou do nome do aluno

        :param : id , usuário_nome

        :return: O usuário pesquisado
        """

        usuario = {}
        for pesquisa in DbAluno.query(DbAluno.usuario_nome == usuario_nome, order_by=DbAluno.id):
            usuario = pesquisa

        if usuario == '' and usuario == None:
            return False
        else:
            return usuario

    def aluno_delete(self, id):
        """
        deleta o aluno por id , futuramente por matricula e/ou nome
        :param id: o id do usuário no banco de dados
        :return: None
        """

        usuario = self.load(id)

        # usuario = DbAluno(id=id)
        usuario.delete(str('id'))

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
            usuario = self.load(retorno.id)
            usuario.pontos_j1 += pontos
            usuario.cliques_j1 += clique
            usuario.desempenho_aluno_j1 = (usuario.pontos_j1 / usuario.cliques_j1) * 100
            usuario.desempenho_aluno_j1 = (usuario.pontos_j1 / usuario.cliques_j1) * 100

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

    def alunos_in_turma(self, escolha, turma_add):

        for escolha in escolha:
            print(escolha)
            usuario = self.load(escolha)
            usuario.turma_do_aluno = turma_add
            print(usuario.turma_do_aluno)

    def comprar_item(self, id_usuario, id_item):
        """
        Metodo para comprar o item
        :param id_usuario: o id do usuario logado na plataforma
        :param id_item: O id do item que vai ser comprado
        :return:
        """
        item = DbLoja()
        usuario = DbAluno.load(id_usuario)
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


class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)
    quem_criou = TextField()

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

        """

        turma_dic = []

        for turma in self.query(order_by=self.id):
            turma_dic.append(dict(id=turma.id, nome=turma.turma_nome, criador=turma.quem_criou))

        return turma_dic

    def delete_turma(self, id):
        """
        Deleta as turmas por id , por enquanto nao implementado

        :param id: O id da turma
        :return: None
        """
        turma = DbTurma(id=id)
        turma.delete()

    def pesquisaturma(self):

        turma = {}
        for pesquisa in DbTurma.query(DbTurma.turma_nome == turma_nme, order_by=DbTurma.id):
            turma = pesquisa

        if turma == '' and turma is None:
            return False
        else:
            return usuario


class DbLoja(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome_item = TextField()
    tipo_item = IntegerField(default=0)
    preco_item = IntegerField(default=0)

    def create_item(self, nome, tipo, preco):
        """
            Cria o item no banco de dados
        :param nome:Nome do item
        :param tipo:Se ele é cor,rosto,acessorio,corpo
        :param preco: é o preço do item
        :return:
        """
        self.create(nome_item=nome, tipo_item=tipo, preco_item=preco)

    def Read_item(self):
        """
            Leitura dos itens cadastrados na plataforma
        :return: Os itens cadastrados
        """
        itens = []
        for item in self.query(order_by=self.id):
            itens.append(item)

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

        for pesquisa in DbLoja.query(DbLoja.id == id, order_by=DbAluno.id):
            item = pesquisa

        if item == '' and item == None:
            return False
        else:
            return item

    def ja_possui_item(self, usuario_logado):
        """
        Envia se o usuario já comprou o item
        :param usuario_logado: Id do usuario
        :return: Lista de itens que o usuario não tem
        """
        usuario = DbAluno()
        itens_usuario = [x.decode('utf-8') for x in
                         usuario.pesquisa_usuario(usuario_nome=usuario_logado).items_comprado]
        itens = [str(y.id) for y in self.Read_item()]
        lista_teste = [z for z in itens if z not in itens_usuario]

        return lista_teste
