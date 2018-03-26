from bottle import *

from model.aluno_model import DbTurma

"""route, view, get, request, redirect, post"""
from facade.facade import Facade

facade = Facade()

""" Controle aluno """


@route('/aluno')
@view('aluno/aluno')
def aluno_read():
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


""" Cadastro de aluno """


@route('/cadastro_aluno')
@view('aluno/aluno_cadastro')
def aluno():
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


@route('/aluno_cadastro', method='POST')
def create_aluno():
    """
    Direcionamento a pagina para criar aluno buscando , na tpl os parâmetros usuário , senha e matricula
    :return: cria o aluno e volta para a pagina geral aluno
    """
    if facade.create_aluno_facade(request.forms['aluno_nome'], request.forms['senha']):
        redirect('/')
    else:
        print("deu erro na criação do ALuno")


"""Read de aluno"""


@route('/ler_aluno')
@view('aluno/aluno_read')
def read_aluno():
    """
    Direciona para a função read_aluno_facade

    :return: o dicionario com a id , usuário_nome e senha_aluno para ser usado pela tpl
    """

    """pesquisa_aluno = request.params['']"""
    """ return dict(aluno_pesquisado=pesquisa_aluno)"""

    if True or request.get_cookie("login", secret='2524'):
        usuarios = facade.read_aluno_facade()
        turma = facade.read_turma_facade()
        alunos = [(aluno['id'], aluno['usuario_nome'], aluno['matricula'], aluno['turma_do_aluno']) for aluno in usuarios]
        return dict(aluno_id=alunos, turmas=turma)
    else:
        redirect('/')


@get('/turma_aluno')
def aluno_in_turma():
    escolhidos = request.query_string
    print(escolhidos)
    escolha = [aluno.split('=')[0].split('_')[1] for aluno in escolhidos.split('&') if 'aluno' in aluno]
    turma_add = request.query.get('escolhidos')
    print(escolhidos, escolha, turma_add)
    facade.aluno_in_turma_facade(escolha, turma_add)
    redirect('/')


""" Deletar aluno(usuario) """


@get('/deletar_alunos')
def deletar_aluno():
    """
    Direciona a função delete_aluno_facade para a pagina tpl

    :return: Deleta a entrada de dicionario equivalente e retorna ao menu
    """
    escolhidos = request.query_string
    deletar_ids = [aluno.split('=')[0].split('_')[1] for aluno in escolhidos.split('&') if 'aluno' in aluno]
    print(escolhidos, deletar_ids)
    facade.delete_aluno_facade(deletar_ids)
    redirect('/')





"""Ver medalhas"""


@route('/ver_itens_comprados')
@view('aluno/view_itens')
def ver_itens():
    usuario = facade.pesquisa_aluno_facade(request.get_cookie("login", secret='2524'))
    itens_comprado = facade.ver_item_comprado_facade(usuario.id)
    itens = []
    for y in itens_comprado:
        itens.append(facade.pesquisa_item_facade(y))

    return dict(lista_itens=itens)


@route('/equipar_item', method='POST')
def equipar_item():
    usuario = facade.pesquisa_aluno_facade(request.get_cookie("login", secret='2524'))

    id_item = request.forms['id']
    item = facade.pesquisa_item_facade(id_item)

    facade.equipar_item_facade(usuario.id, item)

    redirect('/ver_itens_comprados')
