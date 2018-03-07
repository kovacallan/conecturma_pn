# -*- coding: utf-8 -*-
from bottle import route, redirect, request, view, get, post
from facade.facade import Facade

facade = Facade()


@route('/loja')
@view('loja/index')
def index():
    if request.get_cookie("login", secret='2524'):
        itens_comprados = facade.JaTemItemFacade(request.get_cookie("login", secret='2524'))
        if itens_comprados:
            """itens = facade.VerItemLojaFacade()"""
            return dict(itens = itens)
            pass
        else:
            return False
    else:
        redirect('/')


@route('/cadastrar_item')
@view('loja/cadastrar_item')
def cadastrar_item():
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


@post('/cadastro_item')
def cadastro_item():
    nome_item = request.forms.nome_item
    preco_item = request.forms.preco_item
    tipo_item = request.forms.tipo_item

    facade.CriarItemLojaFacade(nome_item, tipo_item, preco_item)
    redirect('cadastrar_item')

@route('/ver_item')
@view('loja/ver_item')
def ver_item():
    if request.get_cookie("login", secret='2524'):
        read = facade.VerItemLojaFacade()

        return dict(teste = read)
    else:
        redirect('/')


@get('/compras_loja')
def compras():
    id_item = request.params['id']
    usuario_logado = facade.PesquisaAlunoFacade(request.get_cookie("login", secret='2524'))
    facade.CompraItemFacade(id_usuario=usuario_logado.id, id_item=id_item)

    redirect('/loja')
