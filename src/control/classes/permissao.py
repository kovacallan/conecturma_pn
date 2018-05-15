from bottle import redirect,response
from datetime import datetime

from facade.facade_main import Facade

"""Constante para a key de hash temporariamente"""

KEY_HASH = 'gu3 j0st0çur4'

class Login(object):

    def __init__(self, email,senha):
        self.email = email
        self.senha = senha

    def login_observador(self):
        facade = Facade()

        hash = self.gerar_hash()
        response.set_cookie("KIM", hash, secret=KEY_HASH)

        observador_logado = facade.search_observador_email_facade(email=self.email)
        facade.create_hash_login_facade(int(observador_logado['id']), hash=hash)

        observador_logado = facade.search_observador_email_facade(email=self.email)

        if observador_logado['email'] == self.email:
            if observador_logado['senha'] == self.senha:
                if observador_logado['tipo'] == '0':

                    response.set_cookie("BUMBA", observador_logado, secret=observador_logado['hash_login'])
                    now = datetime.now()
                    facade.login_date_facade(observador_logado['id'], now)
                    facade.create_historico_facade(observador_logado['nome'], observador_logado['tipo'])
                    print('estou logado {}'.format(observador_logado))
                else:

                    response.set_cookie("BUMBA", observador_logado, secret=observador_logado['hash_login'])
                    now = datetime.now()
                    facade.login_date_facade(observador_logado['id'], now)
                    facade.create_historico_facade(observador_logado['nome'], observador_logado['tipo'])
                    print('estou logado {}'.format(observador_logado))
            else:
                redirect('/')
        else:
            redirect('/')

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


def observador(self, function):
    def decorator():

        function()
    return decorator