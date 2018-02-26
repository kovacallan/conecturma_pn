from src.model.redis import DbUsuario


class Facade:

    def __init__(self):
        self.aluno = DbUsuario()

    def CreateAlunoFacade(self, nome, senha):
        self.aluno.create_usuario(nome, senha)

    def ReadAlunoFacade(self):
        return self.aluno.read_usuario()

    def DeleteAlunoFacade(self,id):
        self.aluno.aluno_delete(id)
