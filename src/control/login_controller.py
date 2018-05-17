from bottle import route, view, request, redirect,response
from control.classes.permissao import Login_Observador, Login_Aluno,algum_usuario_logado

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
    senha = request.params['aluno_senha']

    login = Login_Aluno(nome=nome, senha=senha)
    login.login()

@route('/sair')
def controller_login_sair():
    """
    Deleta o cookie
    :return:
    """
    response.delete_cookie("KIM")
    response.delete_cookie("BUMBA")
    redirect('/')