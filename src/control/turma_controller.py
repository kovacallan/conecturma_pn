from bottle import route, view, get, request,redirect
from facade.facade import *

facade = Facade()

""" Controle de Turma """


@route('/turma')
@view('turma/turma')
def turma():
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


""" Create Turma """


@route('/turma_cadastro')
@view('turma/turma_cadastro')
def cadastrar_turma():
    """
    pagina de cadastro de turma
    :return:
    """
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


@get('/cadastro_turma')
def create_turma():
    """
    Pagina para chamar a funçao create_turma , pedindo pelo tpl o parametro turma_nome
    :return: cria uma entrada no banco de dados da turma criada
    """
    turma = request.params['turma_nome']

    facade.CreateTurmaFacade(turma, request.get_cookie("login", secret='2524'))

    redirect('/turma')


""" Read Turma """


@route('/turma_read')
@view('turma/turma_read')
def read_turma():
    """
    Direciona para a pagina que mostra a turma em ordem de id
    :return: a entrada de dicionario que contem o id e o turma_nome
    """
    if request.get_cookie("login", secret='2524'):
        turma = facade.ReadTurmaFacade()
        return dict(turma_id=turma['id'], turma_nome=turma['nome'], criador=turma['criador'])
    else:
        redirect('/')

"""Turma Delete"""


@get('/deletar_turma')
def deletar_turma():
    facade.DeleteTurmaFacade(request.params['id'])
    redirect('/turma')
