from bottle import route,view,request
import bottle
from src.model.redis import *

@route('/')
@view('index')
def index():
    return

@route('/login', method = 'POST')
def login():
    """
    faz o login na conta do usuario recebendo o usuario e senha
    :return: da acesso ao menu , caso o usuario e senha digitados estejam certos
    """
    login_obj = DbUsuario()
    print('teste')
    nome  = request.params['usuario']
    senha = request.params['senha']

    retorno = login_obj.pesquisa_usuario(nome)

    if retorno:
        if retorno['senha'] == senha:
            bottle.redirect('/user_menu')
        else:
            bottle.redirect('/')
    else:
        bottle.redirect('/')


