from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.observador_facade import ObservadorFacade
from facade.escola_facade import EscolaFacade

facade = ObservadorFacade()
escolafacade = EscolaFacade()


@route('/observador/create_observador_diretor', method="POST")
def controller_observador_cadastro():
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = request.params['cpf']
    email = request.params['email']
    tipo = int(request.params['tipo_observador'])
    escola = int(request.params['escola'])
    rede = 0

    if escola == 0:
        redirect('/observador/cadastro?tipo_observador=2')
    else:
        if filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
            facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo,
                                            escola=escola,rede = rede)
            redirect('/')
        else:
            print("Erro para salvar")
            redirect('/observador')


def filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
    valida = ValidaNome(ValidaSenha(ValidaTelefone(ValidaCpf(ValidaEmail(ValidaTipo(ValidaOk()))))))
    return valida.validacao(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo)
