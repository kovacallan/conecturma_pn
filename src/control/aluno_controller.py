from facade.facade_main import Facade

facade = Facade()




class Aluno_controler(object):
    # def __init__(self):
    #     pass


    def update_aluno(self,id,nome,nome_login):
        facade.update_aluno_facade(id=id,nome=nome,nome_login=nome_login)

