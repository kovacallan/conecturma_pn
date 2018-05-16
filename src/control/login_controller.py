import bottle
from bottle import route, view
from control.classes.permissao import *

facade = Facade()

@route('/')
@view('login/index')
def view_login_index():
    """
    Cria um cookie com base no usuario que loga , sendo diferentes os cookies para o aluno e para os observadores
    :return:
    """
    return

@route('/login/login_observador', method='POST')
def login_observador_controller():
    email = request.params['observador_login_email']
    senha = request.params['observador_senha']

    login = Login(email=email, senha=senha)
    login.login_observador()

    redirect('/aluno/loja')



@route('/login/login_aluno', method='POST')
def login_observador_controller():
    usuario = request.params['aluno_login_nome']
    senha = request.params['aluno_senha']
    print('Entrei aqui Aluno')

def gerar_hash():
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

