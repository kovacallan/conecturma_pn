from bottle import route, request, redirect, response, template, get
from facade.facade_main import Facade
from control.classes.permissao import Login

facade = Facade()

@route('/login_observador', method='POST')
def controller_login_entrar_observador():
    """
    Faz o login na conta do usuário recebendo o usuário e senha

    :return: da acesso a pagina de gestao de aprendizagem(menu), caso o usuário e senha digitados estejam certos
    """

    login = Login(email=email, senha=senha)

    email = request.params['usuario']
    senha = request.params['senha']

    login.login_observador()

@route('/esqueci_senha')
def view_esqueci_senha():
    return template('login/esqueci_senha.tpl')

@route('/view_reformular_senha')
def view_esqueci_senha():
    email = request.params['email']
    pesquisa = facade.search_observador_email_facade(email=email)
    teste = facade.read_observador_facade()
    print(teste)
    return template('login/reformular_senha.tpl', id=pesquisa['id'], email=pesquisa['email'])

@route('/controller_reformular_senha', method="POST")
def controller_esqueci_senha():
    id=request.params['id']
    senha = request.params['senha']
    facade.redefinir_senha_facade(id=int(id),senha=senha)
    redirect('/esqueci_senha')


