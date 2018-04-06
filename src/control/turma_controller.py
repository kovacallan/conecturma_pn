from bottle import route, view, get, request, redirect
from facade.facade import *

facade = Facade()

""" Controle de Turma """


@route('/turma')
@view('turma/turma')
def turma():
    return


""" Create Turma """


@route('/turma_cadastro')
@view('turma/turma_cadastro')
def cadastrar_turma():
    """
    pagina de cadastro de turma
    :return:
    """
    return

@route('/cadastro_turma', method='POST')
def create_turma():
    """
    Pagina para chamar a funçao create_turma , pedindo pelo tpl o parametro turma_nome
    :return: cria uma entrada no banco de dados da turma criada
    """
    turma = request.forms['turma_nome']

    facade.create_turma_facade(turma, request.get_cookie("login", secret='2524'))

    redirect('/turma')


""" Read Turma """


@route('/turma_read')
@view('turma/turma_read')
def read_turma():
    """
    Direciona para a pagina que mostra a turma em ordem de id
    :return: a entrada de dicionario que contem o id e o turma_nome
    """

    turmi = facade.read_turma_facade()
    turmas = [(turma['id'], turma['nome'],turma['criador'], turma['desempenho_j1'], turma['desempenho_j2']) for turma
              in turmi]
    return dict(turma=turmas)

"""Turma Delete"""


@get('/deletar_turma')
def deletar_turma():
    """deleta a turma(futuramente apenas colocará no cemiterio)"""
    facade.delete_turma_facade(request.params['id'])
    redirect('/turma')
