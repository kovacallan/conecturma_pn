# encoding: utf-8

from bottle import request, redirect,response, template, route, view
from control.permissao import  Login_Observador, Login_Aluno, usuario_logado, algum_usuario_logado
from facade.facade_main import *

facade = Facade()

@route('/')
@algum_usuario_logado
@view('templates/login/index')
def view_login_index():
    return

@route('/login/<usuario_tipo>', method='POST')
def login_controller(usuario_tipo):
    if usuario_tipo == 'login_observador':
        email = request.params['observador_login_email']
        senha = request.params['observador_senha']

        login = Login_Observador(email=email, senha=senha)

        return login.login()

    elif usuario_tipo == 'login_aluno':
        nome = request.params['aluno_login_nome']
        senha = request.params['aluno_senha']

        login = Login_Aluno(nome=nome, senha=senha)

        return login.login()


@route('/esqueci_senha')
def view_esqueci_senha():
    return template('login/esqueci_senha.tpl')

@route('/view_reformular_senha')
def view_reformular_senha():
    email=usuario_logado()['email']
    # email = request.params['email']
    pesquisa = facade.search_observador_email_facade(email=email)
    return template('login/reformular_senha.tpl', id=pesquisa['id'], email=pesquisa['email'])

@route('/controller_reformular_senha', method="POST")
def controller_esqueci_senha():
    id = request.params['id']
    senha = request.params['senha']
    facade.redefinir_senha_facade(id=int(id), senha=senha)
    redirect('/esqueci_senha')

@route('/sair')
def controller_login_sair():
    """
    Deleta o cookie
    :return:
    """
    cookies = ['ONLINE_MODE','UV1AV1UDundefined',
            'UV1AVundefinedUDundefined','VIDEO.UV1AV1UD1',
            'VIDEO.UV1AV1UDundefined','VIDEO.UV1AVundefinedUDundefined',
            'UV1AV1UD1', 'BUMBA', 'KIM']
    for i in cookies:
        response.delete_cookie(i)
    redirect('/')

