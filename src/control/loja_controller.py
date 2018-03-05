from bottle import route, redirect, request, view, get
from facade.facade import Facade

facade = Facade()


@route('/loja')
@view('loja/index')
def index():
    if request.get_cookie("login", secret='2524'):
        compras = facade.VerMedalhaFacade(request.get_cookie("login", secret='2524'))
        if compras:
            return dict(array = compras)
        else:
            return dict(array = False)
    else:
        redirect('/')


@get('/compras_loja')
def compras():
    id_medalha = request.params['id']
    id = facade.PesquisaAlunoFacade(request.get_cookie("login", secret='2524'))
    facade.ComprarMedalhaFacade(id=id['id'], id_medalha=id_medalha)

    redirect('/loja')
