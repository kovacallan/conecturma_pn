from src.model.redis import DbUsuario,DbTurma


class Facade:

    def __init__(self):
        """
        metodo para utilizaçao do banco de dados
        """
        self.aluno = DbUsuario()
        self.turma = DbTurma()

    def CreateAlunoFacade(self, nome, senha):
        """
        facada de criar aluno
        :param nome: nome do aluno/usuario
        :param senha: senha do login
        :return: cria o usuario com a senha e armazena no banco de dados
        """
        self.aluno.create_usuario(nome, senha)

    def ReadAlunoFacade(self):
        """
        fachada de leitura de alunos
        :return:retorna a funçao especifica que retorna os dados dos alunos
        """
        return self.aluno.read_usuario()

    def DeleteAlunoFacade(self,id):
        """
        facada de deletar o aluno , atravez da id
        futuramente atravez do nome ,por enquanto foi implementada atravez de botao
        :param id:
        :return: o metodo que deleta o aluno da base de dados
        """
        self.aluno.aluno_delete(id)

    """
        Inicio Facade Turma
    """
    def CreateTurmaFacade(self,nome):
        """
        facada de criaçao de turma
        :param nome:
        :return:
        """
        self.turma.create_turma(nome)

    def ReadTurmaFacada(self):
        """
        facada de ReadTurmaFacada
        :return:
        """
        return self.turma.read_turma

    def DeleteTurmaFacade(self,id):
        """
        facada de DeleteTurmaFacade
        :param id:
        :return:
        """
        self.turma.delete_turma(id)

    """
        Fim Facade Turma
    """