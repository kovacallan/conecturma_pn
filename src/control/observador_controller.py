from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.facade import *

facade = Facade()


@route('/observador')
@view('observador/index')
def view_observador_index():
    return


@route('/observador/cadastro')
@view('observador/create_observador')
def view_observador_cadastro():
    return


@route('/observador/read_observador')
@view('observador/read_observador')
def view_observador_read():
    observador = controller_observador_read()
    return dict(observador=observador)


@get('/observador/editar')
def view_observador_update():
    nome = request.params['nome']
    observador = facade.search_observador_facade(nome)
    return template('observador/update_observador', id=observador['id'], nome=observador['nome'],
                    telefone=observador['telefone'], cpf=observador['cpf'], email=observador['email'])


@get('/observador/create_observador')
def controller_observador_cadastro():
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = request.params['cpf']
    email = request.params['email']
    tipo = request.params['tipo']

    if filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
        facade.create_observador_facade(nome, senha, telefone, cpf, email, tipo.upper())
        redirect('/')
    else:
        print("Erro para salvar")
        redirect('/observador/cadastro')


def controller_observador_read():
    observadores = []
    for observador in facade.read_observador_facade():
        observador['tipo'] = observador['tipo']
        observadores.append(observador)

    return observadores


@route('/observador/update_observador', method='POST')
def controller_observador_update():
    facade.update_observador_facade(id=request.params['id'], nome=request.params['nome'],
                                    telefone=request.params['telefone'], cpf=request.params['cpf'],
                                    email=request.params['email'])
    redirect('/observador/read_observador')


def filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
    valida = ValidaNome(ValidaSenha(ValidaTelefone(ValidaCpf(ValidaEmail(ValidaTipo(ValidaOk()))))))
    return valida.validacao(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo)
