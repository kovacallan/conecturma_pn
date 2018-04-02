from bottle import route, view, get, request, redirect, template
from facade.facade import *

facade = Facade()


@route('/escola')
@view('escola/index')
def view_observador_index():
    return


@route('/observador/cadastro')
@view('escola/create_escola')
def view_observador_cadastro():
    return


@route('/escola/read_escola')
@view('escola/read_escola')
def view_observador_read():
    observador = controller_observador_read()
    return dict(observador=observador)


@get('/escola/editar')
def view_observador_update():
    nome = request.params['nome']
    observador = facade.search_observador_facade(nome)
    return template('observador/update_observador', id =observador['id'], nome=observador['nome'],
                    telefone=observador['telefone'], cpf=observador['cpf'], email=observador['email'])


@get('/escola/escola_observador')
def controller_observador_cadastro():
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = request.params['cpf']
    email = request.params['email']
    tipo = request.params['tipo']


    facade.create_observador_facade(nome, senha, telefone, cpf, email, tipo)
    redirect('/escola')

def controller_observador_read():
    escolas = []
    for escola in facade.read_escola_facade():
        escola['tipo'] = escola(observador['tipo'])
        observadores.append(observador)

    return observadores


@route('/observador/update_observador', method='POST')
def controller_observador_update():

    facade.update_observador_facade(id=request.params['id'] , nome=request.params['nome'],
                                    telefone=request.params['telefone'], cpf=request.params['cpf'],
                                    email=request.params['email'])
    redirect('/observador/read_observador')

