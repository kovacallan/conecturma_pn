from bottle import route, view, get, request, redirect
from facade.facade import *

facade = Facade()

""" Controle de Turma """


@route('/turma')
@view('turma/turma')
def view_turma():
    turmas = controller_read_turma()
    return dict(turma = turmas)


""" Create Turma """


@route('/turma_cadastro')
@view('turma/turma_cadastro')
def view_cadastrar_turma():
    """
    pagina de cadastro de turma
    :return:
    """
    return

def controller_read_turma():
    """
    Direciona para a pagina que mostra a turma em ordem de id
    :return: a entrada de dicionario que contem o id e o turma_nome
    """

    turma = facade.read_turma_facade()
    return turma


@route('/cadastro_turma', method='POST')
def controller_create_turma():
    """
    Pagina para chamar a funçao create_turma , pedindo pelo tpl o parametro turma_nome
    :return: cria uma entrada no banco de dados da turma criada
    """
    turma = request.forms['turma_nome']

    facade.create_turma_facade(turma, request.get_cookie("login", secret='2524'))

    redirect('/turma')


"""Turma Delete"""


@get('/deletar_turma')
def deletar_turma():
    facade.delete_turma_facade(request.params['id'])
    redirect('/turma')
