from bottle import redirect,response
from datetime import datetime

from facade.facade_main import Facade

class Login(object):

    def __init__(self, email,senha):
        self.email = email
        self.senha = senha

    def login_observador(self):
        facade = Facade()
        observador_logado = facade.search_observador_email_facade(email=self.email)
        facade.create_hash_login_facade(int(observador_logado['id']), hash=self.gerar_hash())

        if observador_logado['email'] == self.email:
            if observador_logado['senha'] == self.senha:
                if observador_logado['tipo'] == '0':
                    response.set_cookie("login", observador_logado, secret=observador_logado['hash_login'])
                    now = datetime.now()
                    facade.login_date_facade(observador_logado['id'], now)
                    facade.create_historico_facade(observador_logado['nome'], observador_logado['tipo'])
                    redirect('/pag_administrador')
                else:
                    response.set_cookie("login", observador_logado, secret=observador_logado['hash_login'])
                    now = datetime.now()
                    facade.login_date_facade(observador_logado['id'], now)
                    facade.create_historico_facade(observador_logado['nome'], observador_logado['tipo'])
                    redirect('/gestao_aprendizagem')
            else:
                redirect('/')
        else:
            redirect('/')

    def administrador(self, function):
        def decorator():
            print('teste')
        return decorator

    def gerar_hash(self):
        """
        Usa um algoritmo aleatório para criar um numero de matricula de 5 números

        :return: O numero da matricula do aluno
        """
        from random import randrange

        hash = []
        for i in range(0, 5):
            hash.append(randrange(1, 9))
        matricula = ''.join(str(x) for x in hash)
        return matricula

