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
        print("deu ruim no valida login")
        redirect('/')


@route('/formulario_cadastro')
@view('formulario_cadastro')
def cadastro_view():
    return


@route('/cadastro', method='POST')
def cadastro():
    facade.create_aluno_facade(request.params['aluno_nome'], request.params['senha'])
    redirect('/')


@route('/sair')
def sair():
    response.delete_cookie("login")
    redirect('/')


def valida_login(nome, senha):
    retorno = facade.pesquisa_aluno_facade(nome)
    if retorno:
        if retorno.nome == nome and retorno.senha == senha:
            return True
        else:
            return False
    else:
        return False


# @route('/nova_senha')
# @view('alterar_senha')
# def sem_nome():
#     pass


@route('/alterar_senha')
@view('alterar_senha')
def view_alterar_senha():
    return
@route('/new_senha',method='POST')
def controller_new_senha():

    nome = request.params['usuario']
    senha = request.params['senha']
    senha_nova = request.params['senha_nova']
    senha_conf = request.params['senha_conf']
    if senha_nova != senha_conf:
        redirect('/new_senha')
    retorno = facade.pesquisa_aluno_facade(nome)
    if valida_login(nome, senha):
        facade.aluno.update_aluno(retorno.id, nome, senha_nova)
        redirect('/user_menu')
    else:
        print("deu ruim tentando mudar a senha")
        redirect('/')
@route('/alterar_usuario_nome')
@view('alterar_usuario_nome')
def view_alterar_senha():
    return
@route('/new_nome_user',method='POST')
def controller_new_usuario_nome():

    nome = request.params['usuario']
    senha = request.params['senha']
    nome_novo= request.params['nome_novo']
    retorno = facade.pesquisa_aluno_facade(nome)
    if valida_login(nome, senha):
        facade.aluno.update_aluno(retorno.id, nome_novo, senha)
        create_cookie(nome_novo)
        redirect('/')
    else:
        print("deu ruim tentando mudar o usuario")
        redirect('/')


def create_cookie(parametro):
    response.set_cookie("login", parametro, secret='2524')
