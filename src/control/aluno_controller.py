from bottle import *
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
    facade.CreateAlunoFacade(request.forms['aluno_nome'], request.forms['senha'])
    redirect('/')


"""Read de aluno"""


@route('/ler_aluno')
@view('aluno/aluno_read')
def read_aluno():
    """
    Direciona para a função ReadAlunoFacade

    :return: o dicionario com a id , usuário_nome e senha_aluno para ser usado pela tpl
    """

    """pesquisa_aluno = request.params['']"""
    """ return dict(aluno_pesquisado=pesquisa_aluno)"""

    if request.get_cookie("login", secret='2524'):
        usuarios = facade.ReadAlunoFacade()
        return dict(aluno_id=usuarios['id'], aluno_matricula=usuarios['matricula'], aluno_nome=usuarios['usuario_nome'])
    else:
        redirect('/')

""" Deletar aluno(usuario) """

@get('/aluno_em_turma')
def colocar_aluno():
    id_aluno = request.params['dic_id']
    dict(dic_id=estudante)



""" Deletar aluno(usuario) """

@get('/deletar_alunos')
def deletar_aluno():
    """
    Direciona a função DeleteAlunoFacade para a pagina tpl

    :return: Deleta a entrada de dicionario equivalente e retorna ao menu
    """
    facade.DeleteAlunoFacade(request.params['id'])
    redirect('/aluno')


"""Selecionar alunos para colocar na turma"""


@route('/aluno_turma')
@view('aluno/aluno_turma')
def aluno_in_turma():
    """
    Direciona para o tpl aluno_turma
    :return:None
    """

    turma = facade.ReadTurmaFacade()
    return dict(turma_id=turma['id'], turma_nome=turma['nome'], criador=turma['criador'])


@get('/turma_aluno')
def turma_aluno():
    """
    Capta os alunos a serem movidos para a turma
    :return:
    """
    aluno_id = [request.query.get('aluno_id')]

    print('teste :{}'.format(aluno_id))




    #facade.ColetarAlunos(aluno_id)
    redirect('/aluno_turma')


"""Colocar aluno(s) na turma"""


@route('/turma_read')
@view('turma/turma_read')
def read_turma():
    """
    Direciona para a pagina que mostra a turma em ordem de id
    :return: a entrada de dicionario que contem o id e o turma_nome
    """
    turma = facade.ReadTurmaFacade()
    return dict(turma_id=turma['id'], turma_nome=turma['nome'], criador=turma['criador'])


@get('/escolha_turma')
def escolha_turma():

    facade.IncludeAlunosFacade(request.params('turma_selecionada'))


    redirect('/')

"""Ver medalhas"""


@route('/ver_itens_comprados')
@view('aluno/view_itens')
def ver_itens():
    usuario = facade.PesquisaAlunoFacade(request.get_cookie("login", secret='2524'))
    itens_comprado = facade.VerItemCompradoFacade(usuario.id)
    itens = []
    for y in itens_comprado:
        itens.append(facade.PesquisaItemFacade(y))

    return dict(lista_itens=itens)


@route('/equipar_item', method='POST')
def equipar_item():
    usuario = facade.PesquisaAlunoFacade(request.get_cookie("login", secret='2524'))

    id_item = request.forms['id']
    item = facade.PesquisaItemFacade(id_item)

    facade.equipar_item_facade(usuario.id, item)

    redirect('/ver_itens_comprados')