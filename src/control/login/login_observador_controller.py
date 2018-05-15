from bottle import route, request, redirect, response, template, get
from datetime import datetime
from control.usuarios.administrador_controller import *

from pip._vendor.requests import get

from facade.facade_main import Facade

facade = Facade()

@route('/login_observador', method='POST')
def controller_login_entrar_observador():
    """
    Faz o login na conta do usuário recebendo o usuário e senha

    :return: da acesso a pagina de gestao de aprendizagem(menu), caso o usuário e senha digitados estejam certos
    """
    nome = request.params['usuario']
    senha = request.params['senha']
    observador = valida_login_observador(nome, senha)
    print("login",observador)
    if observador:
        if observador['tipo'] is not '0':
            create_cookie(nome)
            now = datetime.now()
            facade.login_date_facade(observador['id'], now)
            facade.create_historico_facade(observador['nome'], observador['tipo'])
            redirect('/gestao_aprendizagem')
        elif observador['tipo']== '0':
            create_cookie(nome)
            now = datetime.now()
            facade.login_date_facade(observador['id'], now)
            facade.create_historico_facade(observador['nome'], observador['tipo'])
            redirect('/pag_administrador')
    else:
        redirect('/')

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

def valida_login_observador(nome, senha):

    """
    Valida o login do aluno ,
    :param nome: nome de login
    :param senha: senha do usuario
    :return: true se o observador existir e se estiver com usuario e a senha certa
    """
    retorno = facade.search_observador_facade(nome)
    if retorno:
        if retorno['nome'] == nome and retorno['senha'] == senha:
            print("47",nome)
            return retorno
        else:
            return False
    else:
        return False

def create_cookie(parametro):
    response.set_cookie("login", parametro, secret='2525')
