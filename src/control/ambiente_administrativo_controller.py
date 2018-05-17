from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.facade_main import Facade
# from control.historico_controller import *
from control.login.login_observador_controller import *
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
@view('administrativo.tpl')
def view_adm():
    historico = controller_historico_login()
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

@route('/administrador/gestao_aprendizage')
@view('caminho_observador/gestao_aprendizagem.tpl')
def view_gestao_aprendizagem():
# <<<<<<< HEAD
#     adm=facade.search_observador_inativos_facade(request.get_cookie("login",secret='2526'))
#     return dict(usuario=adm.nome, tipo=adm.tipo)
# =======
    adm= usuario_logado()
    print("AC , ADM",adm)
    return dict(usuario=adm['nome'], tipo=adm['tipo'])
# >>>>>>> f7a53178f5b4261ed22e2fe1b99b2ed8a345ad48

@route('/jogarconecturma')
@view('caminho_aluno/jogar_conecturma.tpl')
def view_jogar_conecturma():
# <<<<<<< HEAD
#     adm = facade.search_observador_inativos_facade(request.get_cookie("login", secret='2526'))
#     return dict(usuario=adm.nome, tipo=adm.tipo)
# =======
    adm = usuario_logado()
    return dict(usuario=adm['nome'], tipo=adm['tipo'])
# >>>>>>> f7a53178f5b4261ed22e2fe1b99b2ed8a345ad48


def filtro_cadastro(nome, senha, telefone, email, cpf, tipo):
    valida = ValidaNome(ValidaSenha(ValidaTelefone(ValidaCpf(ValidaEmail(ValidaTipo(ValidaOk()))))))
    return valida.validacao(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo)




@route('/historico')
@view('historico_login')
def view_historico_login():
    """
    pagina vista pelo usuario com o historico de loguin , ainda nao discriminado
    usa metodo : controller_historico_login()
    :return:o dicionario contendo o historico dos usuarios
    """
    historico = controller_historico_login()
    return dict(historico = historico)

def controller_historico_login():
    """
    metodo para pegar o historico
    :return: o metodo de read_historico_facade() armazenado em historico
    """
    historico = facade.read_historico_facade()
    return historico