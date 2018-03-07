from bottle import route, view, request, redirect
from src.facade.facade import Facade
""" Controle do index """

facade = Facade()
@route('/user_menu')
@view('menu')
def hello():
    """ pagina inicial apos login"""
    if request.get_cookie("login", secret='2524'):
        Usuario = facade.PesquisaAlunoFacade(request.get_cookie("login", secret='2524'))
        facade.VerItemCompradoFacade(Usuario.id)
        return dict(usuario = Usuario.usuario_nome)
    else:
        redirect('/')
