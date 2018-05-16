# -*- coding: utf-8 -*-
from bottle import route, redirect, request, view, get, post
from facade.facade_main import *

facade=Facade()

@route('/loja')
@view('loja/index')
def index():
    """
    Mostra os itens comprados e os itens disponiveis para serem comprados na mesma pagina
    metodos usados : ja_tem_item_facade, read_item_loja_facade
    :return: um dicionario com os itens comprados e disponiveis , caso um item nao tenha sido criado previamente
    retorna um dicionario vazio
    """

    itens_comprados = facade.ja_tem_item_facade(request.get_cookie("login", secret='2524'))
    itens = facade.read_item_loja_facade()
    if itens:
        return dict(itens=itens, itens_comprados=str(itens_comprados))
    else:
        return dict(itens=False)


@route('/loja/cadastrar_item')
@view('loja/cadastrar_item')
def cadastrar_item():
    """
    verifica se existe o cookie
    :return:
    """
    return


@route('/cadastro_item', method='post')
def cadastro_item():
    """
    cadastra o item , com nome , preço e tipo
    metodos usados: criar_item_loja_facade
    :return:
    """

    facade.criar_item_loja_facade(nome=request.forms.nome, tipo=request.forms.tipo, preco=request.forms.preco)
    redirect('cadastrar_item')


@route('/ver_item')
@view('loja/ver_item')
def ver_item():
    """
    mostra os itens da loja , os ja criados
    :return:o dicionario com o read
    """
    if request.get_cookie("login", secret='2524'):
        read = facade.read_item_loja_facade()

        return dict(teste=read)
    else:
        redirect('/')


@get('/compras_loja')
def compras():
    """
    compra o item que esta na loja
    metodos usados: pesquisa_aluno_nome_facade,compra_item_facade
    :return:
    """
    id_item = request.params['id']
    usuario_logado = facade.pesquisa_aluno_nome_facade(request.get_cookie("login", secret='2524'))
    facade.compra_item_facade(id_usuario=usuario_logado.id, id_item=id_item)

    redirect('/loja')
