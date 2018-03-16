# -*- coding: utf-8 -*-
from bottle import route, redirect, request, view, get, post
from facade.facade import Facade

facade = Facade()


@route('/loja')
@view('loja/index')
def index():
    if request.get_cookie("login", secret='2524'):
        itens_comprados = facade.JaTemItemFacade(request.get_cookie("login", secret='2524'))
        itens = facade.VerItemLojaFacade()
        if itens:
            return dict(itens = itens, itens_comprados = str(itens_comprados))
        else:
            return dict(itens = False)
    else:
        redirect('/')


@route('/cadastrar_item')
@view('loja/cadastrar_item')
def cadastrar_item():
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


@route('/cadastro_item', method='post')
def cadastro_item():
    nome = request.forms.nome
    preco = request.forms.preco
    tipo = request.forms.tipo

    facade.CriarItemLojaFacade(nome, tipo, preco)
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
