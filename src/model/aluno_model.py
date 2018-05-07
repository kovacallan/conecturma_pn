from walrus import *
from random import randrange
from model.estrutura_model import *

db = Database(host='localhost', port=6379, db=0)

"""A classe DbAluno será usada como Usuário genérico no spike que é , por enquanto, um aluno onipotente"""


class DbAluno(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    matricula = TextField()
    nome = TextField(fts=True, index=True)
    senha = TextField()
    tipo_aluno = TextField(default='0')
    itens_comprados = ListField()
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
    vinculo_escola = TextField(fts=True)
    anotacoes_aluno = ListField()
    vinculo_turma = TextField(fts=True, index=True, default="0")

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
        """backup para evitar a possibilidade de colocar senha vazia"""
        if senha == "" or senha == None:
            return True
        else:
            return False

    def create_aluno(self, nome, vinculo_escola, senha):
        """
        Método principal de criação do usuário no banco de dados

        :param nome: Nome do usuário , que vai servir como login
        :param senha: Senha que será usada pelo usuário para logar na sua conta
        :return: Um novo usuário para ser incluído no banco
        """

        if not self.validar_senha_vazia(senha):
            matricula = self.gerar_matricula()
            self.create(nome=nome, tipo_aluno='6', vinculo_escola=vinculo_escola, senha=senha, matricula=matricula)
            return True
        else:
            return TypeError("Não foi possivel salvar o Usuário")

    def update_aluno(self, id, nome, senha):
        """
            Metodo principal para updade de
        :param id:O id do usuario a tomar update
        :param nome:novo nome , se n tiver um novo nome mantem o antigo
        :param senha: A senha a ser modificada , se n tiver uma nova senha mantem o antigo
        :return:True se conseguir fazer o update e false se nao conseguir mudar nada
        """
        if not self.validar_senha_vazia(senha):
            aluno = self.load(id)
            if nome == aluno.nome:
                pass
            else:
                aluno.nome = nome
            if senha != aluno.senha and senha != "":
                aluno.senha = senha
            else:
                pass
            aluno.save()
            return True
        else:
            return False

    def read_aluno(self):
        """
        Cria uma entrada de dicionario vazia e adiciona os campos de id , matricula e nome do usuario/login

        :return: O dicionario com os dados da id , nome e matricula dos usuários registrados
        """
        alunos = []

        for aluno in self.query(order_by=self.nome):
            alunos.append(dict(id=aluno.id, matricula=aluno.matricula, tipo=aluno.tipo_aluno, cpf=None, nome=aluno.nome,
                               vinculo_rede=None, vinculo_escola=aluno.vinculo_escola,
                               vinculo_turma=aluno.vinculo_turma))
        return alunos

    def pesquisa_usuario(self, usuario_nome):

        """
        pesquisa o aluno através da id, ou do nome do aluno , ainda nao implentado

        :param : id , usuário_nome

        :return: O usuário pesquisado
        """
        usuario = []
        for pesquisa in DbAluno.query(DbAluno.nome == usuario_nome):
            usuario = pesquisa
        return usuario

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
        """
        metodo para cuidar do jogo j1
        :param id:id de quem esta jogando o jogo
        :param pontos: da 0(caso resposta errado) ou 1 (caso resposta certo)
        :return:true , o jogo funcionando
        """
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
        """
         metodo para cuidar do jogo j2
        :param id:id de quem esta jogando o jogo
        :param pontos: da 0 (caso resposta errado) ou 1 (caso resposta certo)
        :return:true , o jogo funcionando
        """
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
        """
        da dinheiro ao usuario
        :param usuario: id do usuario
        :return:
        """
        usuario.pontos_de_moedas += 5

    def mais_vidas(self, usuario):
        """
        da vida ao usuario
        :param usuario: id do usuario
        :return:
        """
        usuario.pontos_de_vida += 1

    def desempenho_jogoj1(self, usuario):
        """
        ve o desempenho do usuario j1 o em porcentagem de acertos
        :param usuario: id do usuario
        :return:
        """
        usuario.desempenho_aluno_j1 = (usuario.pontos_j1 / usuario.cliques_j1) * 100

    def desempenho_jogoj2(self, usuario):
        """
        ve o desempenho do usuario do j2 o em porcentagem de acertos
        :param usuario: id do usuario
        :return:
        """
        usuario.desempenho_aluno_j2 = (usuario.pontos_j2 / usuario.cliques_j2) * 100

    def alunos_in_turma(self, escolha, turma_add):
        """
        Percorre uma lista de alunos selecionados para colocar o id da turma a qual pertence em cada aluno
        turma é um atributo de aluno
        :param escolha: lista de ids de alunos que terão o parâmetro do id da turma acrescentado ao objeto
        :param turma_add: o id da turma escolhida para ser acrescida aos alunos
        :return: None
        """
        res = DbEstrutura.load(turma_add)
        escolhas = []
        for escolha in escolha:
            escolhas.append(escolha.id)
        turma_add = res.nome
        for escolhas in escolhas:
            usuario = self.load(escolhas)
            usuario.vinculo_turma = turma_add
            usuario.save()

    def comprar_item(self, id_usuario, id_item):
        """
        Método para o aluno comprar items

        :param id_usuario: o id do usuário logado na plataforma
        :param id_item: O id do item que vai ser comprado
        :return:
        """
        item = DbEstrutura()
        usuario = DbAluno.load(id_usuario)
        preco = item.search_estrutura_id(id_item)['preco']

        if usuario.pontos_de_moedas < preco:
            print("você não tem moeda")
        else:
            usuario.pontos_de_moedas -= preco
            usuario.itens_comprados.append(id_item)
            usuario.save()

    def ver_itens_comprados(self, id_usuario):
        """
        Mostra os itens cujos os quais usuário tem posse
        :param id_usuario: O usuário que tem os itens
        :return: A lista dos itens
        """
        usuario = self.load(id_usuario)
        itens = [int(''.join(str(x.decode('utf-8')))) for x in usuario.itens_comprados]
        return itens

    def equipar_item(self, id_usuario, itens):
        """
        Equipa o item escolhido pelo usuario , através de botões
        :param id_usuario: O usuario, no caso o atual , que vai equipar os itens
        :param itens:O item que vai ser equipado
        :return: O avatar usando o item(mostrado na pagina do menu)
        """
        usuario = self.load(id_usuario)
        # print(itens)
        if itens['tipo_item'] == '1':
            usuario.cor = itens['id']
        else:
            if itens['tipo_item'] == '2':
                usuario.rosto = itens['id']
            else:
                if itens['tipo_item'] == '3':
                    usuario.acessorio = itens['id']
                else:
                    if itens['tipo_item'] == '4':
                        usuario.corpo = itens['id']
        usuario.save()

    def avatar(self, id):
        """
        O avatar no qual os itens são equipados

        :param id: id do usuario dono do avatar , no caso o atual
        :return: Um dicionario com os atributos do avatar
        """
        usuario = self.usuario_logado(id)
        return dict(cor=usuario.cor, rosto=usuario.rosto, acessorio=usuario.acessorio, corpo=usuario.corpo)

    def definir_nova_senha(self, usuario_id, senha_antiga, senha_nova):
        """Pega o id do usuario e muda a senha"""

        usuario = self.load(usuario_id)
        if senha_antiga == usuario.senha:
            usuario.senha = senha_nova
            usuario.save()
            print(usuario.senha, usuario)
        else:
            print("senha antiga errada")

    def anotacoes_do_aluno(self, id_usuario, mensagem):
        usuario = self.load(id_usuario)
        usuario.anotacoes_aluno.append(mensagem)
        usuario.save()

    def ver_anotacoes_aluno(self, id_aluno):
        aluno = self.load(id_aluno)

        anotacoes = []
        for x in aluno.anotacoes_aluno:
            anotacoes.append(x.decode('utf-8'))

        return anotacoes

    def pesquisa_aluno_turma(self, aluno_, turma_):

        DbAluno.pesquisa_usuario(self, aluno_, turma_)

    def aluno_delete(self, deletar_ids):
        """
        deleta o(s) aluno(s) percorrendo a lista de ids de usuários selecionados

        :param deletar_ids: Uma lista dos usuários a serem deletados
        :return: None
        """
        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def restaurar_aluno(self, matricula, nome, senha, tipo_aluno, cor, rosto, acessorio, corpo, pontos_j1, cliques_j1,
                        pontos_j2, cliques_j2, pontos_de_vida, pontos_de_moedas, desempenho_aluno_j1,
                        desempenho_aluno_j2, vinculo_escola, vinculo_turma):
        if self.create(matricula=matricula, nome=nome, senha=senha, tipo_aluno=tipo_aluno, cor=cor, rosto=rosto,
                       acessorio=acessorio, corpo=corpo, ponto_j1=pontos_j1, cliques_j1=cliques_j1,
                       pontos_j2=pontos_j2, cliques_j2=cliques_j2, pontos_de_vida=pontos_de_vida,
                       pontos_de_moedas=pontos_de_moedas, desempenho_aluno_j1=desempenho_aluno_j1,
                       desempenho_aluno_j2=desempenho_aluno_j2
                , vinculo_escola=vinculo_escola, vinculo_turma=vinculo_turma):
            return True
        else:
            return False

    def apagartudo(self):
        db.flushall()
