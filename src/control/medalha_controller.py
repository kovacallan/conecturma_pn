from bottle import route, view, get, request, redirect
from facade.facade import *

facade = Facade()

""" Controle de medalha """


@route('/medalha')
@view('medalha/medalha')
def turma():
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


""" Create medalha """


@route('/medalha_cadastro')
@view('observador/medalha_cadastro')
def cadastrar_medalha():
    """
    pagina de cadastro de turma
    :return:
    """
    return


@route('/cadastro_medalha', method='POST')
def create_medalha():
    """
    Pagina para chamar a funçao create_turma , pedindo pelo tpl o parametro turma_nome
    :return: cria uma entrada no banco de dados da turma criada
    """
    medalha_nome = request.forms['nome']

    facade.create_medalha_facade(medalha_nome, request.get_cookie("login", secret='2524'))

    redirect('/')


""" Read Turma """


@route('/medalha_read')
@view('aluno/medalha_read')
def read_turma():
    """
    Direciona para a pagina que mostra a turma em ordem de id
    :return: a entrada de dicionario que contem o id e o turma_nome
    """
    if request.get_cookie("login", secret='2524'):
        turmi = facade.read_turma_facade()
        turmas = [(turma['id'], turma['nome'],turma['criador'], turma['desempenho_j1'], turma['desempenho_j2']) for turma
                  in turmi]
        return dict(turma=turmas)
    else:
        redirect('/')

"""Turma Delete"""


@get('/delete_medalha')
def deletar_turma():
    facade.delete_medalha_facade(request.params['id'])
    redirect('/')
