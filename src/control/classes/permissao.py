from bottle import redirect, response, request, error
from datetime import datetime

from facade.facade_main import Facade

"""Constante para a key de hash temporariamente"""

KEY_HASH = 'gu3 j0st0çur4'

TIPO_USUARIOS = dict(
    administrador='0',
    gestor='1',
    diretor='2',
    professor='3',
    responsavel='4',
    responsavel_varejo='5',
    aluno='6',
    aluno_varejo='7'
)


class Login(object):

    def __init__(self, email, senha):
        self.email = email
        self.senha = senha

    def login_observador(self):
        facade = Facade()

        hash = self.gerar_hash()
        response.set_cookie("KIM", hash, path='/', secret=KEY_HASH)

        observador_logado = facade.search_observador_email_facade(email=self.email)

        if observador_logado['email'] == self.email:
            if observador_logado['senha'] == self.senha:
                if observador_logado['tipo'] == '0':
                    response.set_cookie("BUMBA", observador_logado, path='/',secret=hash)
                    now = datetime.now()
                    facade.login_date_facade(observador_logado['id'], now)
                    facade.create_historico_facade(observador_logado['nome'], observador_logado['tipo'])
                    return '/aluno/loja'
                else:
                    response.set_cookie("BUMBA", observador_logado, path='/',secret=hash)
                    now = datetime.now()
                    facade.login_date_facade(observador_logado['id'], now)
                    facade.create_historico_facade(observador_logado['nome'], observador_logado['tipo'])
                    return '/aluno/loja'
            else:
                return '/'
        else:
            return '/'

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


def permissao(quem_tem_permissao):
    def observador(function):
        def decorator(*args, **kwargs):
            banana = request.get_cookie("KIM", secret=KEY_HASH)
            que = request.get_cookie("BUMBA", secret=banana)
            print('{}, {}'.format(int(TIPO_USUARIOS[quem_tem_permissao]), int(que['tipo'])))
            if int(TIPO_USUARIOS[quem_tem_permissao]) >= int(que['tipo']):
                return function(*args, **kwargs)
            else:
                redirect('/error403')
        return decorator

    return observador
