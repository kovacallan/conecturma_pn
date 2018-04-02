from bottle import route, request, redirect, response
from facade.facade import Facade

facade = Facade()

@route('/login_observador', method='POST')
def controller_login_entrar_observador():
    """
    faz o login na conta do usuário recebendo o usuário e senha
    :return: da acesso ao menu , caso o usuário e senha digitados estejam certos
    """
    nome = request.params['usuario']
    senha = request.params['senha']

    if valida_login_observador(nome, senha):
        create_cookie(nome)
        redirect('/gestao_aprendizagem')
    else:
        redirect('/')



def valida_login_observador(nome, senha):
    retorno = facade.search_observador_facade(nome)
    if retorno:
        if retorno['nome'] == nome and retorno['senha'] == senha:
            return True
        else:
            return False
    else:
        return False

def create_cookie(parametro):
    response.set_cookie("login", parametro, secret='2525')
