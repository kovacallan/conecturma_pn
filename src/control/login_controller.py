from bottle import route, view, request, redirect,response, template
from facade.facade_main import *
from control.classes.permissao import Login_Observador, Login_Aluno,algum_usuario_logado

facade = Facade()

@route('/')
@algum_usuario_logado
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

    login = Login_Observador(email=email, senha=senha)
    redirect(login.login())

@route('/login/login_aluno', method='POST')
def login_observador_controller():
    nome = request.params['aluno_login_nome']
    presenha = request.forms.getall('aluno_senha')
    senha=''.join(presenha)
    print(senha)
    login = Login_Aluno(nome=nome, senha=senha)
    redirect(login.login())

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
    response.delete_cookie("KIM")
    response.delete_cookie("BUMBA")
    redirect('/')