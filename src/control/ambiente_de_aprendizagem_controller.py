from bottle import route,view, request, redirect, response,get, template
from facade.facade_main import Facade
from control.classes.permissao import permissao, usuario_logado
from control.dicionarios import *

facade=Facade()

@route('/aluno/area_aluno')
@permissao('aluno_varejo')
@view('caminho_aluno/jogar_conecturma')
def view_ambiente_de_aprendizagem():
    """ pagina inicial apos login , que mostra os itens equipados no avatar"""
    if int(usuario_logado()['tipo'])>=6:
        usuario = facade.search_aluno_nome_facade(usuario_logado()['nome'])
    else:
        usuario = facade.search_observador_facade(usuario_logado()['nome'])

    avatar = facade.avatar_facade(usuario['id'])

    avatar_pecas = {
        'cor': facade.search_estrutura_id_facade(avatar['cor'])['nome'],
        'rosto': facade.search_estrutura_id_facade(avatar['rosto'])['nome'],
        'acessorio': facade.search_estrutura_id_facade(avatar['acessorio'])['nome'],
        'corpo': facade.search_estrutura_id_facade(avatar['corpo'])['nome']
    }

    return dict(usuario=usuario['nome'], avatar = avatar_pecas,tipo=usuario_logado()['tipo'])

@route('/aluno/loja')
@permissao('aluno_varejo')
@view('caminho_aluno/index_loja')
def view_ambiente_de_aprendizagem_loja():
    """
    Mostra os itens comprados e os itens disponiveis para serem comprados na mesma pagina
    metodos usados : ja_tem_item_facade, read_estrutura_facade
    :return: um dicionario com os itens comprados e disponiveis , caso um item nao tenha sido criado previamente
    retorna um dicionario vazio"""

    itens_comprados = facade.ver_item_comprado_facade(id_usuario=usuario_logado()['id'])
    itens = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'])

    if itens:
        return dict(itens=itens, itens_comprados=itens_comprados)
    else:
        return dict(itens=False)

@route('/aluno/ver_itens_comprados')
@permissao('aluno_varejo')
@view('caminho_aluno/view_itens')
def ver_itens():
    """
    mostra os itens que o usuario tem posse
    chama os metodos : search_aluno_nome_facade, ver_item_comprado_facade e pesquisa_iten_facade
    cria uma lista com os ids dos itens do aluno
    :return: dicionario de itens
    """

    usuario = usuario_logado()
    itens_comprado = facade.ver_item_comprado_facade(usuario['id'])
    itens = []
    for y in itens_comprado:
        itens.append(facade.search_estrutura_id_facade(int(y)))

    return dict(lista_itens=itens)


@route('/equipar_item', method='POST')
@permissao('aluno_varejo')
def equipar_item():
    """
    Equipar o avatar
    metodos chamados: search_aluno_nome_facade,search_estrutura_by_id e equipar_item_facade
    :return:
    """
    id_item = request.forms['id']
    item = facade.search_estrutura_id_facade(int(id_item))

    facade.equipar_item_facade(usuario_logado()['id'], item)

    redirect('/aluno/ver_itens_comprados')

@route('aluno/ver_item')
@permissao('aluno_varejo')
@view('loja/ver_item')
def ver_item():
    """
    mostra os itens da loja , os ja criados
    :return:o dicionario com o read
    """
    item = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'])

    return dict(teste=item)

@get('/compras_loja')
@permissao('aluno_varejo')
def compras():
    """
    compra o item que esta na loja
    metodos usados: search_aluno_nome_facade,compra_item_facade
    :return:
    """
    id_item = request.params['id']
    facade.compra_item_facade(id_usuario=usuario_logado()['id'], id_item=id_item)

    redirect('aluno/loja')

@route('/jogo')
def jogo():
    return template('jogo/index')