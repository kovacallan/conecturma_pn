from bottle import route, view, get, request, redirect
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
    if request.get_cookie("login", secret='2524'):
        usuarios = facade.ReadAlunoFacade()
        return dict(aluno_id=usuarios['id'], aluno_matricula=usuarios['matricula'], aluno_nome=usuarios['usuario_nome'])
    else:
        redirect('/')


""" Deletar aluno(usuario) """


@get('/deletar_alunos')
def deletar_aluno():
    """
    Direciona a função DeleteAlunoFacade para a pagina tpl

    :return: Deleta a entrada de dicionario e retorna a pagina geral aluno
    """
    facade.DeleteAlunoFacade(request.params['id'])
    redirect('/aluno')


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
