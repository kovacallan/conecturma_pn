from model.redis import DbUsuario, DbTurma


class Facade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.aluno = DbUsuario()
        self.turma = DbTurma()

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

    def DeleteAlunoFacade(self, id):
        """
        facade de deletar o aluno , atravez da id
        futuramente atravez do nome ,por enquanto foi implementada atravez de botao
        :param id:
        :return: o metodo que deleta o aluno da base de dados
        """
        self.aluno.aluno_delete(id)

    def PesquisaAlunoFacade(self, nome):
        return self.aluno.pesquisa_usuario(nome)

    def PontoJogoFacade(self, usuario, jogo, ponto, clique):
        self.aluno.pontos_jogo(usuario, jogo, ponto, clique)

    def ColetarAlunos(self, aluno_id):
        return self.aluno.coletar_alunos(aluno_id)

    def IncludeAlunosFacade(self, id_turma):
        self.aluno.alunos_in_turma(id_turma)

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
