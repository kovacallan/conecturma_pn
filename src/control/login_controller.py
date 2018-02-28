from bottle import route, view, request, redirect, response
from facade.facade import Facade

facade = Facade()


@route('/')
@view('index')
def index():
    if request.get_cookie("teste", secret='2524'):
        redirect('/user_menu')
    else:
        return


@route('/login', method='POST')
def login():
    nome = request.params['usuario']
    senha = request.params['senha']

    retorno = facade.PesquisaAlunoFacade(nome)

    if retorno:
        if retorno['senha'] == senha:
            response.set_cookie("teste", nome, secret='2524')
            redirect('/user_menu')
        else:
            redirect('/')
    else:
        redirect('/')


@route('/formulario_cadastro')
@view('formulario_cadastro')
def cadastro_view():
    return


@route('/cadastro', method='POST')
def cadastro():
    facade.CreateAlunoFacade(request.params['aluno_nome'], request.params['senha'])
    redirect('/')
