from bottle import *

"""route, view, get, request, redirect, post"""
from facade.rede_facade import RedeFacade

facade = RedeFacade()
"""Controle da rede"""


@route('/rede')
@view("rede/rede")
def view_index_rede():
    """
    pagina inicial de rede
    :return: None
    """
    redes = controller_read_rede()
    return dict(redes=redes)


@route('/rede/create_rede')
@view('rede/create_rede')
def view_rede_cadastro():
    """
    Vizualizaçao da pagina de criar redes
    :return: vazio
    """
    return

@route('/rede/update_rede')
@view('modificar_rede')
def view_modificar_rede():
    pass


@route('/rede/criar_rede', method='POST')
def controller_create_rede():
    """
    criar rede
    :return:
    """
    nome = request.params['nome_rede']
    telefone = request.params['telefone']
    facade.create_rede_facade(nome, telefone)
    redirect('/rede')


def controller_read_rede():
    """
    pagina de ler as redes criadas , armazena os atributos da rede em uma entrada de dicionario
    :return: o dicionario com os atributos de rede a serem mostrados
    """
    redes = facade.read_rede_facade()
    rede = []
    if redes is None:
        return None
    else:
        for x in redes:
            rede.append(x)

        return rede



