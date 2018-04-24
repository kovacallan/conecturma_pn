from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.observador_facade import ObservadorFacade
from facade.escola_facade import EscolaFacade

facade = ObservadorFacade()
escolafacade = EscolaFacade()

"""Tipo = 1"""
@route('/observador/create_observador_gestor', method="POST")
def controller_observador_cadastro():
    """
    Cria gestor , com nome , senha , telefone , email, e rede (Tipo=1)
    :return:
    """
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = request.params['cpf']
    email = request.params['email']
    tipo = request.params['tipo_observador']
    rede = request.params['rede']
    escola = '0'

    if rede == '0':
        redirect('/observador/cadastro?tipo_observador=1')
    else:
        if filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
            facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf,email=email, tipo=tipo,
                                            rede=rede,escola=escola)
            redirect('/usuario')
        else:
            print("Erro para salvar")
            redirect('/observador/cadastro?tipo_observador=1')


def filtro_cadastro(nome, senha, telefone, email, cpf,tipo):
    """
    verifica se algum dos parametros obrigatorios esta vazio , se estiver nao permite o cadastro
    :param nome:
    :param senha:
    :param telefone:
    :param email:
    :param cpf:
    :param tipo:
    :return:
    """
    valida = ValidaNome(ValidaSenha(ValidaTelefone(ValidaCpf(ValidaEmail(ValidaTipo(ValidaOk()))))))
    return valida.validacao(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo)
