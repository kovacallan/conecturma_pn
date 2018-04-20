from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.observador_facade import ObservadorFacade
from facade.escola_facade import EscolaFacade

observador_facade = ObservadorFacade()
escola_facade = EscolaFacade()

"""Tipo = 3"""
@route('/observador/create_observador_professor', method="POST")
def controller_observador_cadastro():
    """
    Cria um professor com nome , senha , telefone ,email e escola(recebe o id)
    :return:
    """
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = 0
    email = request.params['email']
    tipo = int(request.params['tipo_observador'])
    escola = int(request.params['escola'])
    rede = 0

    if escola == 0:
        redirect('/observador/cadastro?tipo_observador=3')
    else:
        if filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
            observador_facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo,
                                                       escola=escola, rede=0)
            redirect('/usuario')
        else:
            print("Erro para salvar")
            redirect('/observador/cadastro?tipo_observador=3')


def filtro_cadastro(nome, senha, telefone, email, cpf,tipo):
    """
    Verifica se nenhum padrao obrigatorio vazio
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
