from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.observador_facade import ObservadorFacade
from facade.rede_facade import  RedeFacade
from facade.escola_facade import EscolaFacade

facade = ObservadorFacade()
escolafacade = EscolaFacade()
redefacade = RedeFacade()

@route('/observador')
@view('observador/index')
def view_observador_index():
    observador=controller_observador_read()
    return dict(observador = observador)


@route('/observador/cadastro')
def view_observador_cadastro():
    tipo_observador = int(request.params['tipo_observador'])
    escola = escolafacade.read_escola_facade()
    rede = redefacade.read_rede_facade()

    if tipo_observador == 0:
        return template('observador/create_observador_administrador',tipo = tipo_observador)
    elif tipo_observador == 1:
        return template('observador/create_observador_gestor',tipo = tipo_observador, rede = rede)
    elif tipo_observador == 2:
        return template('observador/create_observador_diretor', tipo = tipo_observador, escola = escola)
    elif tipo_observador == 3:
        return template('observador/create_observador_professor',tipo = tipo_observador, escola = escola)
    elif tipo_observador == 4:
        redirect('/observador')
    else:
        redirect('/observador')

@get('/observador/editar')
def view_observador_update():
    nome = request.params['nome']
    observador = facade.search_observador_facade(nome)
    return template('observador/update_observador', id=observador['id'], nome=observador['nome'],
                    telefone=observador['telefone'], cpf=observador['cpf'], email=observador['email'])


def controller_observador_read():
    observadores=facade.read_observador_facade()
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
