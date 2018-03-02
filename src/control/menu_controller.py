from bottle import route, view, request, redirect

from src.facade import facade
from src.model.redis import DbUsuario

""" Controle do index """


@route('/user_menu')
@view('menu')
def hello():
    """ pagina inicial apos login"""
    if request.get_cookie("login", secret='2524'):
        return
    else:
        redirect('/')

"""@get('/login')
def bem_vindo():
    usuario = DbUsuario.load(retorno['id'])
    request.params = usuario.usuario_nome
  """
