from model.redis import DbAluno, DbTurma, DbLoja


class Facade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.aluno = DbAluno()
        self.turma = DbTurma()
        self.loja = DbLoja()

    """
        Inicio Facade Usuario/Aluno
    """

    def CreateAlunoFacade(self, nome, senha):
        """
        facade de criar aluno
        :param nome: nome do aluno/usuario
        :param senha: senha do login
        :return: cria o usuario com a senha e armazena no banco de dados
        """
        self.aluno.create_usuario(nome, senha)

    def ReadAlunoFacade(self):
        """
        facade de leitura de alunos
        :return:retorna a função especifica que retorna os dados dos alunos
        """
        return self.aluno.read_usuario()

    def deleteAlunoFacade(self, deletar_ids):
        """
        facade de deletar o aluno , atravez da id
        futuramente atravez do nome ,por enquanto foi implementada atravez de botao
        :param id:
        :return: o metodo que deleta o aluno da base de dados
        """
        self.aluno.aluno_delete(deletar_ids)

    def PesquisaAlunoFacade(self, nome):
        return self.aluno.pesquisa_usuario(nome)

    def PontoJogoFacade(self, usuario, jogo, ponto, clique):
        self.aluno.pontos_jogo(usuario, jogo, ponto, clique)

    def include_aluno_in_turma(self, escolhidos, turma_add):
        self.aluno.alunos_in_turma(escolhidos, turma_add)


    def CompraItemFacade(self, id_usuario, id_item):
            self.aluno.comprar_item(id_usuario=id_usuario, id_item=id_item)

    def VerItemCompradoFacade(self, id_usuario):
        return self.aluno.ver_itens_comprados(id_usuario)

    def equipar_item_facade(self, id, itens):
        self.aluno.equipar_item(id_usuario=id, itens=itens)

    def avatar_facade(self, id):
        return self.aluno.avatar(id)

    """
        Fim Facade Usuario/Aluno
    """

    """
        Inicio Facade Turma
    """

    def CreateTurmaFacade(self, nome, login):
        """
        facade de criaçao de turma
        :param nome:
        :return:
        """
        self.turma.create_turma(nome, login)

    def ReadTurmaFacade(self):
        """
        facade de ReadTurmaFacada
        :return:
        """
        return self.turma.read_turma()

    def DeleteTurmaFacade(self, id):
        """
        facade de DeleteTurmaFacade
        :param id:
        :return:
        """
        self.turma.delete_turma(id)

    """
        Fim Facade Turma
    """

    """
        Inicio Facade loja
    """

    def CriarItemLojaFacade(self, nome, tipo, preco):
        self.loja.create_item(nome, tipo, preco)

    def VerItemLojaFacade(self):
        return self.loja.Read_item()

    def PesquisaItemFacade(self, id):
        return self.loja.pesquisar_item(id)

    def JaTemItemFacade(self, usuario_logado):
        return self.loja.ja_possui_item(usuario_logado=usuario_logado)

    """
        Fim Facade loja
    """
