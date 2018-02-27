from bottle import route,view,request,redirect
from bottle import route,view,request,redirect
from facade.facade import Facade

facade = Facade()

@route('/')
@view('index')
def index():
    return

@route('/login', method = 'POST')
def login():
    nome  = request.params['usuario']
    senha = request.params['senha']

    retorno = facade.PesquisaAlunoFacade(nome)

    if retorno:
        if retorno['senha'] == senha:
            redirect('/user_menu')
        else:
            redirect('/')
    else:
        redirect('/')
