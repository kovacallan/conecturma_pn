from bottle import route,view, request, redirect, response
from facade.facade_main import *
from control.classes.permissao import permissao
facade=Facade()

"""Tipo=6"""

@route('/aluno/area_aluno')
@view('caminho_aluno/jogar_conecturma')
def view_jogar_conecturma():
    """ pagina inicial apos login , que mostra os itens equipados no avatar"""
    if request.get_cookie("login", secret='2524'):
        usuario = facade.pesquisa_aluno_facade(request.get_cookie("login", secret='2524'))
        avatar = facade.avatar_facade(usuario.id)
        if usuario.cor == "0":
            cor = 'default'
        else:
            cor =facade.pesquisa_item_facade(avatar['cor'])['nome']

        if usuario.rosto == "0":
            rosto = 'default'
        else:
            rosto = facade.pesquisa_item_facade(avatar['rosto'])['nome']
        if usuario.acessorio == "0":
            acessorio = 'default'
        else:
            acessorio = facade.pesquisa_item_facade(avatar['acessorio'])['nome']
        if usuario.corpo == "0":
            corpo = 'default'
        else:
            corpo = facade.pesquisa_item_facade(avatar['corpo'])['nome']

        avatar_pecas = {'cor': cor,
                        'rosto': rosto,
                        'acessorio': acessorio,
                        'corpo': corpo}
        return dict(usuario=usuario.nome, avatar = avatar_pecas ,tipo="6")
    elif request.get_cookie("login", secret='2526'):
        # usuario = facade.search_observador_inativos_facade(request.get_cookie("login", secret='2526'))
        # avatar = facade.avatar_facade(usuario.id)
        # if usuario.cor == 0:
        #     cor = 'default'
        # else:
        #     cor = facade.pesquisa_item_facade(avatar['cor'])['nome']
        #
        # if usuario.rosto == 0:
        #     rosto = 'default'
        # else:
        #     rosto = facade.pesquisa_item_facade(avatar['rosto'])['nome']
        # if usuario.acessorio == 0:
        #     acessorio = 'default'
        # else:
        #     acessorio = facade.pesquisa_item_facade(avatar['acessorio'])['nome']
        # if usuario.corpo == 0:
        #     corpo = 'default'
        # else:
        #     corpo = facade.pesquisa_item_facade(avatar['corpo'])['nome']
        #
        # avatar_pecas = {'cor': cor,
        #                 'rosto': rosto,
        #                 'acessorio': acessorio,
        #                 'corpo': corpo}
        # return dict(usuario=usuario.nome, avatar=avatar_pecas)
        return dict(usuario="administrador", tipo="0")
    else:
        redirect('/')

@route('/aluno/loja')
@permissao('diretor')
@view('caminho_aluno/index_loja')
def index():
    """
    Mostra os itens comprados e os itens disponiveis para serem comprados na mesma pagina
    metodos usados : ja_tem_item_facade, read_item_loja_facade
    :return: um dicionario com os itens comprados e disponiveis , caso um item nao tenha sido criado previamente
    retorna um dicionario vazio"""

    #itens_comprados = facade.ja_tem_item_facade(request.get_cookie("login", secret='2524'))
    itens_comprados = []
    itens = facade.read_item_loja_facade()
    if itens:
        return dict(itens=itens, itens_comprados=str(itens_comprados))
    else:
        return dict(itens=False)

@route('/aluno/ver_itens_comprados')
@view('caminho_aluno/view_itens')
def ver_itens():
    """
    mostra os itens que o usuario tem posse
    chama os metodos : pesquisa_aluno_facade, ver_item_comprado_facade e pesquisa_iten_facade
    cria uma lista com os ids dos itens do aluno

    :return: dicionario de itens
    """

    usuario = facade.pesquisa_aluno_facade(request.get_cookie("login", secret='2524'))
    itens_comprado = facade.ver_item_comprado_facade(usuario.id)
    itens = []
    for y in itens_comprado:
        itens.append(facade.pesquisa_item_facade(y))

    return dict(lista_itens=itens)


@route('/equipar_item', method='POST')
def equipar_item():
    """
    Equipar o avatar
    metodos chamados: pesquisa_aluno_facade,pesquisa_item_facade e equipar_item_facade
    :return:
    """

    usuario = facade.pesquisa_aluno_facade(request.get_cookie("login", secret='2524'))

    id_item = request.forms['id']
    item = facade.pesquisa_item_facade(id_item)

    facade.equipar_item_facade(usuario.id, item)

    redirect('/aluno/ver_itens_comprados')

