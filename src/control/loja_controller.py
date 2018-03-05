from bottle import route, redirect, request, view, get
from facade.facade import Facade

facade = Facade()


@route('/loja')
@view('loja/index')
def index():
    if request.get_cookie("login", secret='2524'):
        compras = facade.VerMedalhaFacade(request.get_cookie("login", secret='2524'))
        if compras:
            return dict(array=compras)
        else:
            return dict(array=False)
    else:
        redirect('/')


@route('/cadastrar_item')
@view('loja/cadastrar_item')
def cadastrar_item():
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')


@get('/cadastro_item')
def cadastro_item():
    nome_item = request.params['nome_item']
    preco_item = request.params['preco_item']
    tipo_item = request.params['tipo_item']

    facade.CriarItemLojaFacade(nome_item, preco_item, tipo_item)


@route('/ver_item')
@view('loja/ver_item')
def cadastrar_item():
    if request.get_cookie("login", secret='2524'):
        read = facade.ReaditemLojaFacade()

        return dict(teste = read)
    else:
        redirect('/')


@get('/compras_loja')
def compras():
    id_medalha = request.params['id']
    id = facade.PesquisaAlunoFacade(request.get_cookie("login", secret='2524'))
    facade.ComprarMedalhaFacade(id=id['id'], id_medalha=id_medalha)

    redirect('/loja')
