from bottle import redirect, response, request, error
from datetime import datetime

from src.facade.facade_main import Facade

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

PAGINA_INICIAL = dict(
    administrador='/administrador/pag_administrador',
    gestor='/gestao_aprendizagem',
    diretor='/gestao_aprendizagem',
    professor='/gestao_aprendizagem',
    responsavel='/gestao_aprendizagem',
    responsavel_varejo='/gestao_aprendizagem',
    aluno='/aluno/area_aluno',
    aluno_varejo='/aluno/area_aluno'
)


class Login_Observador(object):

    def __init__(self, email, senha):
        self.email = email
        self.senha = senha

    def login(self):
        facade = Facade()

        hash = self.gerar_hash()
        response.set_cookie("KIM", hash, path='/', secret=KEY_HASH)

        observador_logado = facade.search_observador_email_facade(email=self.email)
        print("permissao L46",observador_logado,observador_logado['email'],self.email)

        if observador_logado['email'] == self.email:
            if observador_logado['senha'] == self.senha:
                if observador_logado['tipo'] == '0':
                    response.set_cookie("BUMBA", observador_logado, path='/',secret=hash)
                    now = datetime.now()
                    facade.login_date_facade(observador_logado['id'], now)
                    facade.create_historico_facade(observador_logado['nome'], observador_logado['tipo'])
                    return '/administrador/pag_administrador'
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

class Login_Aluno(object):
    def __init__(self, nome, senha):
        self.nome = nome
        self.senha = senha

    def login(self):
        facade = Facade()
        hash = self.gerar_hash()
        aluno_logado = facade.pesquisa_aluno_nome_facade(nome = self.nome)
        response.set_cookie("KIM", hash, path='/', secret=KEY_HASH)
        if aluno_logado['nome'] == self.nome:
            if aluno_logado['senha'] == self.senha:
                response.set_cookie("BUMBA", aluno_logado, path='/', secret=hash)
                redirect('/aluno/area_aluno')
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

def usuario_logado():
    banana = request.get_cookie("KIM", secret=KEY_HASH)
    que = request.get_cookie("BUMBA", secret=banana)

    return que

def algum_usuario_logado(function):
    def decorator(*args,**kwargs):
        banana = request.get_cookie("KIM", secret=KEY_HASH)
        que = request.get_cookie("BUMBA", secret=banana)
        if que and banana:
            redirect(PAGINA_INICIAL[tipo_observador(que['tipo'])])
        else:
            return function(*args, **kwargs)
    return decorator

def permissao(quem_tem_permissao):
    def observador(function):
        def decorator(*args, **kwargs):
            banana = request.get_cookie("KIM", secret=KEY_HASH)
            que = request.get_cookie("BUMBA", secret=banana)
            if banana and que:
                if int(TIPO_USUARIOS[quem_tem_permissao]) >= int(que['tipo']):
                    return function(*args, **kwargs)
                else:
                    redirect('/error403')
            else:
                redirect('/')
        return decorator

    return observador

def tipo_observador(tipo):
    if tipo == '0':
        return 'administrador'
    elif tipo == '6':
        return 'aluno'
    elif tipo == '7':
        return 'aluno_varejo'
    elif tipo == '3':
        return 'professor'
    elif tipo == '5':
        return 'responsavel_varejo'
    elif tipo == '4':
        return 'responsavel'
    elif tipo == '2':
        return 'diretor'
    elif tipo == '1':
        return 'gestor'
