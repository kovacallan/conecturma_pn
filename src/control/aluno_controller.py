from facade.facade_main import Facade

facade = Facade()




class Aluno_controler(object):

    def update_aluno(self,id,nome,nome_login,turma):
        facade.update_aluno_facade(id=id,nome=nome,nome_login=nome_login,turma=turma)

