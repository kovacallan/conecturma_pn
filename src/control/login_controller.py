from bottle import route, view, request, redirect, response
from facade.facade import Facade

facade = Facade()


@route('/')
@view('index')
def index():
    if request.get_cookie("login", secret='2524'):
        redirect('/user_menu')
    else:
        return


@route('/login', method='POST')
def login():
    """
    faz o login na conta do usuário recebendo o usuário e senha
    :return: da acesso ao menu , caso o usuário e senha digitados estejam certos
    """
    nome = request.params['usuario']
    senha = request.params['senha']

    if valida_login(nome, senha):
        create_cookie(nome)
        redirect('/user_menu')
    else:
        redirect('/')


@route('/formulario_cadastro')
@view('formulario_cadastro')
def cadastro_view():
    return


@route('/cadastro', method='POST')
def cadastro():
    facade.CreateAlunoFacade(request.params['aluno_nome'], request.params['senha'])
    redirect('/')


@route('/sair')
def sair():
    response.delete_cookie("login")
    redirect('/')


def valida_login(nome, senha):
    retorno = facade.PesquisaAlunoFacade(nome)
    if retorno != False:
        if retorno['nome'] == nome and retorno['senha'] == senha:
            return True
        else:
            return False
    else:
        return False


def create_cookie(parametro):
    response.set_cookie("login", parametro, secret='2524')
