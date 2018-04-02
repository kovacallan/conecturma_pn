from bottle import *

"""route, view, get, request, redirect, post"""
from facade.facade import Facade

facade = Facade()
"""Controle da rede"""


@route('/rede')
@view("rede/rede")
def view_index_rede():
    """
    pagina inicial de rede
    :return: None
    """
    return


@route('/create_rede')
@view('rede/create_rede')
def view_rede_cadastro():
    """
    Vizualizaçao da pagina de criar redes
    :return: vazio
    """
    return


@route('/criar_rede', method='POST')
def create_rede_controller():
    nome = request.params['nome_rede']
    cod = request.params['cod']
    telefone = request.params['telefone']
    facade.create_rede_facade(nome, cod, telefone)
    redirect('/rede')


@route('/read_rede')
@view('rede/ler_redes')
def view_read_rede():
    nome = facade.read_rede_facade()
    redes = [(rede['id'], rede['nome'], rede['cod'], rede['telefone']) for rede in nome]
    return dict(rede_id=redes)


@route('/update_rede')
@view('modificar_rede')
def view_modificar_rede():
    pass
