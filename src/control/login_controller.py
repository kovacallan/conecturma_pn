from bottle import route, view, request, redirect,response, template
from facade.facade_main import *
from control.classes.permissao import Login_Observador, Login_Aluno,algum_usuario_logado

facade = Facade()

@route('/')
@algum_usuario_logado
@view('login/index')
def view_login_index():

    return

@route('/login/login_observador', method='POST')
def login_observador_controller():
    email = request.params['observador_login_email']
    senha = request.params['observador_senha']

    login = Login_Observador(email=email, senha=senha)
    login.login()

    return

@route('/login/login_aluno', method='POST')
def login_aluno_controller():
    nome = request.params['aluno_login_nome']
    senha = request.params['aluno_senha']

    login = Login_Aluno(nome=nome, senha=senha)
    return login.login()

@route('/esqueci_senha')
def view_esqueci_senha():
    return template('login/esqueci_senha.tpl')

@route('/view_reformular_senha')
def view_esqueci_senha():
    email = request.params['email']
    pesquisa = facade.search_observador_email_facade(email=email)
    teste = facade.read_observador_facade()
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
