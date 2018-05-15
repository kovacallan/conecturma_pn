from bottle import route, view, request, redirect, response
from facade.facade_main import Facade
from control.classes.permissao import *

facade = Facade()



@route('/')
@view('login/index')
def view_login_index():
    """
    Cria um cookie com base no usuario que loga , sendo diferentes os cookies para o aluno e para os observadores
    :return:
    """

@route('/login/login_observador', method='POST')
@observador
def login_observador_controller():
    email = request.params['observador_login_email']
    senha = request.params['observador_senha']

    login = Login(email=email, senha=senha)
    login.login_observador()

    print('Entrei aqui Observador')

@route('/login/login_aluno', method='POST')
def login_observador_controller():
    usuario = request.params['aluno_login_nome']
    senha = request.params['aluno_senha']
    print('Entrei aqui Aluno')


