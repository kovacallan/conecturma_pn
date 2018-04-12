from bottle import route, request, redirect, response
from datetime import datetime
from facade.observador_facade import ObservadorFacade
from facade.historico_facade import HistoricoFacade

observador_facade = ObservadorFacade()
historico_facade = HistoricoFacade()
@route('/login_observador', method='POST')
def controller_login_entrar_observador():
    """
    faz o login na conta do usuário recebendo o usuário e senha
    :return: da acesso ao menu , caso o usuário e senha digitados estejam certos
    """
    nome = request.params['usuario']
    senha = request.params['senha']
    observador = valida_login_observador(nome, senha)
    if observador:
        create_cookie(nome)
        now = datetime.now()
        observador_facade.login_date_facade(observador['id'], now)
        historico_facade.create_historico_facade(observador['nome'], observador['tipo'])
        redirect('/gestao_aprendizagem')
    else:
        redirect('/')



def valida_login_observador(nome, senha):
    retorno = observador_facade.search_observador_facade(nome)
    if retorno:
        if retorno['nome'] == nome and retorno['senha'] == senha:
            return retorno
        else:
            return False
    else:
        return False

def create_cookie(parametro):
    response.set_cookie("login", parametro, secret='2525')
