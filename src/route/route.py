# -*- coding: utf-8 -*-
from bottle import route, view, get
from control.classes.permissao import permissao, algum_usuario_logado, usuario_logado
from facade.facade_main import Facade

facade = Facade()

"""
Rotas da Tela de Login
"""


@route('/')
@algum_usuario_logado
@view('login/index')
def view_login_index():
    return


@route('/login/login_observador', method='POST')
def login_observador_controller():
    from control.login_controller import login_observador_controller
    return login_observador_controller()


@route('/login/login_aluno', method='POST')
def login_aluno_controller():
    from control.login_controller import login_aluno_controller
    return login_aluno_controller()


@route('/esqueci_senha')
def view_esqueci_senha():
    from control.login_controller import view_esqueci_senha
    return view_esqueci_senha()


@route('/view_reformular_senha')
def view_reformular_senha():
    from control.login_controller import view_reformular_senha
    return view_reformular_senha()


@route('/controller_reformular_senha', method="POST")
def controller_esqueci_senha():
    from control.login_controller import controller_esqueci_senha
    return controller_esqueci_senha()


@route('/sair')
def controller_login_sair():
    from control.login_controller import controller_login_sair
    return controller_login_sair()


"""
Rotas da Tela de do Ambiente de aprendizagem
"""


@route('/aluno/area_aluno')
@permissao('aluno_varejo')
@view('caminho_aluno/jogar_conecturma')
def view_ambiente_de_aprendizagem():
    from control.aprendizagem_controller import view_ambiente_de_aprendizagem
    return view_ambiente_de_aprendizagem()



@route('/aluno/guarda_roupa')
@permissao('aluno_varejo')
def view_guarda_roupa():
    from bottle import template
    from control.guarda_roupa_controller import Guarda_roupa

    guarda_roupa = Guarda_roupa(usuario_logado=usuario_logado())
    guarda_roupa.get_item_student_have()
    return template('caminho_aluno/guarda_roupa/index', cores=guarda_roupa.get_cor(), rostos=guarda_roupa.get_rosto(), acessorios=guarda_roupa.get_acessorio(), corpos=guarda_roupa.get_corpo)


@route('/jogo')
def jogo():
    from bottle import template
    return template('jogo/index')


@route('/api/plataforma/obterUltimaConclusao', method='POST')
def obterUltimaConclusao():
    from control.aprendizagem_controller import obterUltimaConclusao
    return obterUltimaConclusao()


@route('/api/plataforma/verificarAcessoObjetoAprendizagem', method='POST')
def verificarAcessoObjetoAprendizagem():
    from control.aprendizagem_controller import verificarAcessoObjetoAprendizagem
    return verificarAcessoObjetoAprendizagem()


@route('/api/plataforma/verificarConclusoesObjetosAprendizagem', method='POST')
def verificarConclusoesObjetosAprendizagem():
    from control.aprendizagem_controller import verificarConclusoesObjetosAprendizagem
    return verificarConclusoesObjetosAprendizagem()


@route('/api/plataforma/registrarConclusao', method='POST')
def registrarConclusao():
    from control.aprendizagem_controller import registrarConclusao
    return registrarConclusao()


@route('/api/plataforma/obterPremiacao', method='POST')
def obterPremiacao():
    from control.aprendizagem_controller import obterPremiacao
    return obterPremiacao()


@route('/api/plataforma/verificarAcessoUnidade', method='POST')
def verificarAcessoUnidade():
    from control.aprendizagem_controller import verificarAcessoUnidade
    return verificarAcessoUnidade()


@route('/api/plataforma/verificarAcessoAventura', method='POST')
def verificarAcessoAventura():
    from control.aprendizagem_controller import verificarAcessoAventura
    return verificarAcessoAventura()


"""
Rotas da Tela de do gestão de aprendizagem
"""


@route('/gestao_aprendizagem')
@permissao('responsavel_varejo')
@view('gestao_aprendizagem/gestao_aprendizagem')
def view_gestao_aprendizagem():
    from control.gestao_aprendizagem_controller import view_gestao_aprendizagem
    return view_gestao_aprendizagem()


@route('/gestao_aprendizagem/usuario')
@permissao('professor')
@view('gestao_aprendizagem/usuario/usuario')
def view_usuario_index():
    from control.gestao_aprendizagem_controller import view_usuario_index
    return view_usuario_index()


@route('/usuario/cadastro_usuario', method='POST')
@permissao('professor')
def cadastro_usuario():
    from control.gestao_aprendizagem_controller import cadastro_usuario
    return cadastro_usuario()


@get('/observador/editar')
@permissao('professor')
def view_observador_update():
    from control.gestao_aprendizagem_controller import view_observador_update
    return view_observador_update()


@route('/observador/update_observador', method='POST')
@permissao('professor')
def controller_observador_update():
    from control.gestao_aprendizagem_controller import controller_observador_update
    return controller_observador_update()


@route('/observador/email_existe', method='POST')
@permissao('professor')
def controller_checar_se_email_existe():
    from control.gestao_aprendizagem_controller import controller_checar_se_email_existe
    return controller_checar_se_email_existe()


@route('/medalha_cadastro')
@view('observador/medalha_cadastro.tpl')
def cadastrar_medalha():
    return


@route('/create_medalha', method='POST')
def controller_medalha_cadastro():
    from control.gestao_aprendizagem_controller import controller_medalha_cadastro
    return controller_medalha_cadastro()


@route('/ler_medalha')
@permissao('professor')
@view('observador/medalha_index.tpl')
def read_de_medalha():
    from control.gestao_aprendizagem_controller import read_de_medalha
    return read_de_medalha()


@route('/rede')
@permissao('gestor')
@view("gestao_aprendizagem/rede/rede")
def view_index_rede():
    from control.gestao_aprendizagem_controller import view_index_rede
    return view_index_rede()


@route('/rede/criar_rede', method='POST')
@permissao('gestor')
def controller_create_rede():
    from control.gestao_aprendizagem_controller import controller_create_rede
    return controller_create_rede()


@route('/rede/editar_rede', method='POST')
@permissao('gestor')
def controller_editar_rede():
    from control.gestao_aprendizagem_controller import controller_editar_rede
    return controller_editar_rede()


@route('/escola')
@view('gestao_aprendizagem/escola/escola')
def view_escola_index():
    from control.gestao_aprendizagem_controller import view_escola_index
    return view_escola_index()


@route('/escola/criar_escola', method='POST')
@permissao('gestor')
def controller_escola_cadastro():
    from control.gestao_aprendizagem_controller import controller_escola_cadastro
    return controller_escola_cadastro()


@route('/escola/editar_escola', method='POST')
@permissao('diretor')
def controller_escola_editar():
    from control.gestao_aprendizagem_controller import controller_escola_update
    return controller_escola_update()


@route('/deletar_estrutura', method='POST')
@permissao('diretor')
def controller_estrutura_deletar():
    from control.gestao_aprendizagem_controller import controller_estrutura_delete
    return controller_estrutura_delete()


@route('/turma')
@permissao('professor')
@view('gestao_aprendizagem/turma/turma')
def view_turma():
    from control.gestao_aprendizagem_controller import view_turma
    return view_turma()


@route('/turma/cadastro_turma', method='POST')
@permissao('diretor')
def controller_create_turma():
    from control.gestao_aprendizagem_controller import controller_create_turma
    return controller_create_turma()


@route('/turma/update_turma', method='POST')
@permissao('professor')
def controller_turma_editar():
    from control.gestao_aprendizagem_controller import controller_edit_turma
    print('hi')
    return controller_edit_turma()

@route('/turma/turma_update_controller', method='POST')
@permissao('diretor')
def controller_update_turma():
    from control.gestao_aprendizagem_controller import controller_update_turma
    return controller_update_turma()


@route('/cadastro_descritor_view')
@view('descritor/index.tpl')
def descritores():
    return


@route('/relatorios/aluno')
@permissao('professor')
@view('gestao_aprendizagem/relatorios/aluno/relatorio_aluno')
def relatorio_aluno_view():
    from control.relatorio_controller import Relatorio
    from control.gestao_aprendizagem_controller import get_nome_turma

    relatorio = Relatorio()
    relatorio.get_alunos(usuario_online_dados=usuario_logado(), nome_turma=get_nome_turma)


    return dict(tipo = usuario_logado()['tipo'], alunos = relatorio.alunos)


@route('/relatorios/visualizar_relatorio_aluno')
@view('gestao_aprendizagem/relatorios/aluno/relatorio_aluno_detalhe')
def relatorio_aluno():
    from bottle import request
    from facade.facade_main import Facade
    from control.relatorio_controller import Relatorio

    relatorio = Relatorio()

    aluno = facade.search_aluno_id_facade(id_aluno=request.params['aluno'])
    turma = facade.search_estrutura_id_facade(id=aluno['vinculo_turma'])

    relatorio.get_descritores(serie=turma['serie'])
    relatorio.get_desempenho(descritores=relatorio.descritores, aluno=aluno)
    relatorio.convert_nivel_for_numeric()
    relatorio.set_color_face()
    relatorio.set_pontuacao_porcentagem()

    return dict(tipo = usuario_logado()['tipo'], aluno=aluno, oa=relatorio.descritores, porcentagem=relatorio.porcentagem,
                pontos=relatorio.porcentagem_solo)

@route('/trazer_oas')
def levar_oas_matematica():
    from control.gestao_aprendizagem_controller import levar_oas_matematica
    return levar_oas_matematica()


"""
Rotas da Tela de do gestão de aprendizagem
"""


@route('/observador/create_observador_administrador', method="POST")
@permissao('administrador')
def controller_observador_cadastro():
    from control.administrativo_controller import controller_observador_cadastro
    return controller_observador_cadastro()


@route('/administrador/pag_administrador')
@permissao('administrador')
@view('areas_administrativo.tpl')
def view_adm():
    return


@route('/pesquisa_aluno_in_turma')
def pesquisar_aluno_turma():
    from control.administrativo_controller import pesquisar_aluno_turma
    return pesquisar_aluno_turma()


@route('/loja/cadastrar_item')
@permissao('administrador')
@view('loja/cadastrar_item.tpl')
def cadastrar_item():
    return


@route('/cadastro_item', method='post')
def cadastro_item():
    from control.administrativo_controller import cadastro_item
    return cadastro_item()


@route('/administrador/cadastro_descritor_view')
def cadastro_descritor_view():
    from control.administrativo_controller import cadastro_descritor_view
    return cadastro_descritor_view()


@route('administrativo/cadastro_descritor_controller', method='post')
def cadastro_descritor_controller():
    pass


@route('/usuarios_inativados')
@view('inativados/inativados.tpl')
def index_desativados():
    return


@route('/usuarios_deletados')
@view('inativados/usuarios_inativados')
def desativados():
    from control.administrativo_controller import desativados
    return desativados()

@get('/new_senha')
def new_password():
    from control.administrativo_controller import new_password
    return new_password()

@route('/novasenha', method='post')
def novasenha():
    from control.administrativo_controller import novasenha
    return novasenha()