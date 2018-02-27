from src.model.redis import DbUsuario,DbTurma


class Facade:

    def __init__(self):
        self.aluno = DbUsuario()
        self.turma = DbTurma()

    def CreateAlunoFacade(self, nome, senha):
        self.aluno.create_usuario(nome, senha)

    def ReadAlunoFacade(self):
        return self.aluno.read_usuario()

    def DeleteAlunoFacade(self,id):
        self.aluno.aluno_delete(id)

    """
        Inicio Facade Turma
    """
    def CreateTurmaFacade(self,nome):
        self.turma.create_turma(nome)

    def ReadTurmaFacada(self):
        return self.turma.read_turma

    def DeleteTurmaFacade(self,id):
        self.turma.delete_turma(id)

    """
        Fim Facade Turma
    """