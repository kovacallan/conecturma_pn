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

    def create_aluno_facade(self, nome, senha):
        """
        facade de criar aluno
        :param nome: nome do aluno/usuario
        :param senha: senha do login
        :return: cria o usuario com a senha e armazena no banco de dados
        """
        self.aluno.create_usuario(nome, senha)

    def read_aluno_facade(self):
        """
        facade de leitura de alunos
        :return:retorna a função especifica que retorna os dados dos alunos
        """
        return self.aluno.read_usuario()

    def delete_aluno_facade(self, deletar_ids):
        """
        facade de deletar o aluno , atravez da id
        futuramente atravez do nome ,foi implementado por nome e checkbox
        :param id:uma lista de ids a serem deletados
        :return: o metodo que deleta o aluno da base de dados
        """
        self.aluno.aluno_delete(deletar_ids)

    def pesquisa_aluno_facade(self, nome):
        return self.aluno.pesquisa_usuario(nome)

    def ponto_jogo_facade(self, usuario, jogo, ponto):
        self.aluno.pontos_jogo(usuario, jogo, ponto)

    def aluno_in_turma_facade(self, escolhidos, turma_add):
        self.aluno.alunos_in_turma(escolhidos, turma_add)


    def compra_item_facade(self, id_usuario, id_item):
            self.aluno.comprar_item(id_usuario=id_usuario, id_item=id_item)

    def ver_item_comprado_facade(self, id_usuario):
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

    def create_turma_facade(self, nome, login):
        """
        facade de criaçao de turma
        :param nome:
        :return:
        """
        self.turma.create_turma(nome, login)

    def read_turma_facade(self):
        """
        facade de ReadTurmaFacada
        :return:
        """
        return self.turma.read_turma()

    def delete_turma_facade(self, id):
        """
        facade de delete_turma_facade
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

    def criar_item_loja_facade(self, nome, tipo, preco):
        self.loja.create_item(nome, tipo, preco)

    def ver_item_loja_facade(self):
        return self.loja.Read_item()

    def pesquisa_item_facade(self, id):
        return self.loja.pesquisar_item(id)

    def deletar_item(self, id):
        self.loja.item_delete(id)

    def ja_tem_item_facade(self, usuario_logado):
        return self.loja.ja_possui_item(usuario_logado = usuario_logado)

    """
        Fim Facade loja
    """