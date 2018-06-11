from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.facade_main import Facade
# from control.historico_controller import *
from control.ambiente_de_gestao_de_aprendizagem_controller import *
from control.classes.permissao import permissao, usuario_logado
from control.dicionarios import TIPO_USUARIOS_ID

facade = Facade()

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
    cpf = '0'
    email = request.params['email']
    tipo = request.params['tipo_observador']
    rede = '0'
    escola = '0'

    facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo,
                                    rede=rede, escola=escola)
    redirect('/observador')

@route('/administrador/pag_administrador')
@permissao('administrador')
@view('areas_administrativo.tpl')
def view_adm():
    historico = []
    for h in facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['historico']):
        h['tipo_usuario'] = TIPO_USUARIOS_ID[h['tipo_usuario']]
        h['data_acesso'] = '{}/{}/{} - {}:{}:{}'.format(h['data_acesso'].day, h['data_acesso'].month,
                                                      h['data_acesso'].year, h['data_acesso'].hour, 
                                                      h['data_acesso'].minute, h['data_acesso'].second)
        historico.append(h)
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

@route('/loja/cadastrar_item')
@permissao('administrador')
@view('loja/cadastrar_item')
def cadastrar_item():
    """
    verifica se existe o cookie
    :return:
    """
    return


@route('/cadastro_item', method='post')
def cadastro_item():
    """
    cadastra o item , com nome , preço e tipo
    metodos usados: create_estrutura_facade
    :return:
    """

    facade.create_estrutura_facade(nome=request.forms.nome, tipo_item=request.forms.tipo, preco=request.forms.preco,tipo_estrutura='4')
    redirect('cadastrar_item')

@route('/administrador/cadastro_descritor_view')
def cadastro_descritor_view():
    return template('descritor/index')

@route('administrativo/cadastro_descritor_controller', method='post')
def cadastro_descritor_controller():
    pass

@route('/teste')
def fazendo_teste():
    print("to aqui")