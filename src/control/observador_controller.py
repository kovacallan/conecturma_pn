from bottle import route, view, get, request, redirect, template
from facade.facade import *

facade = Facade()


@route('/observador')
@view('observador/index')
def view_observador_index():
    """pagina inicial de observador"""
    return


@route('/observador/cadastro')
@view('observador/create_observador')
def view_observador_cadastro():
    """
    view de pagina de cadastro de observador
    :return:
    """
    return


@route('/observador/read_observador')
@view('observador/read_observador')
def view_observador_read():
    """
    pagina para vizualisar os observadores cadastrados , armazenando-os num dicionario
    (armazenado no metodo controller_observador_read e tenque indicar a tpl q é dict
    Metodos usados:controller_observador_read
    :return: o dicionario preenchido com os observadores cadastrados
    """
    observador = controller_observador_read()
    return dict(observador=observador)


@get('/observador/editar')
def view_observador_update():
    """
    pega o nome e edita os dados do observador
    metodos usados:search_observador_facade
    :return: o template para preencher os dados a serem editados
    """
    nome = request.params['nome']
    observador = facade.search_observador_facade(nome)
    return template('observador/update_observador', id =observador['id'], nome=observador['nome'],
                    telefone=observador['telefone'], cpf=observador['cpf'], email=observador['email'])


@get('/observador/create_observador')
def controller_observador_cadastro():
    """
    pega os parametros para cadastrar um observador
    metodos usados: filtro_cadastro , create_observador_facade
    :return:
    """
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = request.params['cpf']
    email = request.params['email']
    tipo = request.params['tipo']

    if filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
        facade.create_observador_facade(nome, senha, telefone, cpf, email, tipo.upper())
        redirect('/observador/cadastro')
    else:
        print("Erro para salvar")


def controller_observador_read():
    """
    metodo para armazenar os observadores numa lista
    :return:
    """
    observadores = []
    for observador in facade.read_observador_facade():
        observador['tipo'] = observador['tipo']
        observadores.append(observador)

    return observadores


@route('/observador/update_observador', method='POST')
def controller_observador_update():
    """
    metodo para chamar o metodo update_observador_facade
    :return:
    """

    facade.update_observador_facade(id=request.params['id'] , nome=request.params['nome'],
                                    telefone=request.params['telefone'], cpf=request.params['cpf'],
                                    email=request.params['email'])
    redirect('/observador/read_observador')

def filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
    """
    metodo para evitar qualquer coisa vir vazia
    :param nome: nome do observador
    :param senha: senha do observador
    :param telefone: telefone do observador , opcional dependendo do tipo de observador
    :param cpf: cpf
    :param email: email do observador
    :param tipo:
    :return:
    """
    if nome == "":
        return False
    elif senha == "":
        return False
    elif telefone == "":
        return False
    elif cpf == "":
        return False
    elif email == "":
        return False
    elif tipo == "":
        return False
    else:
        return True
