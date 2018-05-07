from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.facade_main import Facade


facade = Facade()

"""Tipo = 3"""
@route('/observador/create_observador_professor', method="POST")
def controller_observador_cadastro():
    """
    Cria um professor com nome , senha , telefone ,email e escola(recebe o id)
    :return:
    """
    tipo = request.params['tipo']
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    email = request.params['email']
    escola = request.params['escola']

    if escola == 0:
        redirect('/observador/cadastro?tipo_observador=3')
    else:
        if filtro_cadastro(nome, senha, telefone, email, tipo):
            facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, email=email, tipo=tipo,
                                            escola=escola)
        else:
            print("Erro para salvar")
            redirect('/observador/cadastro?tipo_observador=3')

@route('/observador/email_existe', method='POST')
def controller_checar_se_email_existe():
    email = request.params['teste_email']
    verificacao = facade.search_observador_email_facade(email=email)
    if verificacao is not None:
        return verificacao['email']
    else:
        return None


def filtro_cadastro(nome, senha, telefone, email, tipo):
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
    return valida.validacao(nome=nome, senha=senha, cpf=0,telefone=telefone, email=email, tipo=tipo)
