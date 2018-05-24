from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.facade_main import Facade
# from control.historico_controller import *
from control.ambiente_de_gestao_de_aprendizagem_controller import *
from control.classes.permissao import permissao, usuario_logado


facade = Facade()


"""Tipo = 0"""


@route('/observador/create_observador_administrador', method="POST")
@permissao('administrador')
def controller_observador_cadastro():
    """
    Cria o administradores , com nome , senha e telefone (tipo==0)
    :return:
    """
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = 0
    email = request.params['email']
    tipo = int(request.params['tipo_observador'])
    rede = 0
    escola = 0

    if filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
        facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo,
                                        rede=rede, escola=escola)
        redirect('/observador')
    else:
        print("Erro para salvar")
        redirect('/observador')


@route('/administrador/pag_administrador')
@permissao('administrador')
@view('areas_administrativo.tpl')
def view_adm():
    historico = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['historico'])
    return dict(historico=historico)


@route('/pesquisa_aluno_in_turma')
def pesquisar_aluno_turma():
    """
    Pesquisa o aluno dentro da turma
    :return:
    """
    aluno_ = request.params['nome_do_aluno']
    turma_ = request.params['nome_da_turma']
    facade.pesquisa_aluno_turma_facade(aluno_, turma_)

# @route('/gestao_aprendizagem')

def filtro_cadastro(nome, senha, telefone, email, cpf, tipo):
    valida = ValidaNome(ValidaSenha(ValidaTelefone(ValidaCpf(ValidaEmail(ValidaTipo(ValidaOk()))))))
    return valida.validacao(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo)

