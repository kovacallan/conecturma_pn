from bottle import route, view, request, redirect
from facade.facade_main import Facade
from control.login.login_observador_controller import *
from control.login.login_aluno_controller import *

""" Controle do index """

facade = Facade()

@route('/jogar_conecturma')
@view('jogar_conecturma')
def view_jogar_conecturma():
    """ pagina inicial apos login , que mostra os itens equipados no avatar"""
    if request.get_cookie("login", secret='2524'):
        usuario = facade.pesquisa_aluno_nome_facade(request.get_cookie("login", secret='2524'))
        avatar = facade.avatar_facade(usuario.id)
        print("menu_controller",usuario.cor)
        if usuario.cor == "0":
            print("aqui?")
            cor = 'default'
        else:
            print("why??")
            cor =facade.search_estrutura_by_id(avatar['cor'])['nome']
        if usuario.rosto == "0":
            rosto = 'default'
        else:
            rosto = facade.search_estrutura_by_id(avatar['rosto'])['nome']
        if usuario.acessorio == "0":
            acessorio = 'default'
        else:
            acessorio = facade.search_estrutura_by_id(avatar['acessorio'])['nome']
        if usuario.corpo == "0":
            corpo = 'default'
        else:
            corpo = facade.search_estrutura_by_id(avatar['corpo'])['nome']

        avatar_pecas = {'cor': cor,
                        'rosto': rosto,
                        'acessorio': acessorio,
                        'corpo': corpo}
        return dict(usuario=usuario.nome, avatar = avatar_pecas ,tipo="6")

    elif request.get_cookie("login", secret='2526'):
        # usuario = facade.search_observador_inativos_facade(request.get_cookie("login", secret='2526'))
        # avatar = facade.avatar_facade(usuario.id)
        # if usuario.cor == 0:
        #     cor = 'default'
        # else:
        #     cor = facade.search_estrutura_by_id(avatar['cor'])['nome']
        #
        # if usuario.rosto == 0:
        #     rosto = 'default'
        # else:
        #     rosto = facade.search_estrutura_by_id(avatar['rosto'])['nome']
        # if usuario.acessorio == 0:
        #     acessorio = 'default'
        # else:
        #     acessorio = facade.search_estrutura_by_id(avatar['acessorio'])['nome']
        # if usuario.corpo == 0:
        #     corpo = 'default'
        # else:
        #     corpo = facade.search_estrutura_by_id(avatar['corpo'])['nome']
        #
        # avatar_pecas = {'cor': cor,
        #                 'rosto': rosto,
        #                 'acessorio': acessorio,
        #                 'corpo': corpo}
        # return dict(usuario=usuario.nome, avatar=avatar_pecas)
        return dict(usuario="administrador", tipo="0")
    else:
        redirect('/')

@route('/gestao_aprendizagem')
@view('gestao_aprendizagem')
def view_gestao_aprendizagem():
    if request.get_cookie("login", secret='2525'):
        observador = facade.search_observador_facade(request.get_cookie("login", secret='2525'))
        return dict(usuario = observador['nome'], tipo = observador['tipo'])

@route('/alterar_senha')
@view('alterar_senha')
def view_alterar_senha():
    return

@route('/new_senha',method='POST')
def controller_new_senha():

    nome = request.params['usuario']
    senha = request.params['senha']
    senha_nova = request.params['senha_nova']
    senha_conf = request.params['senha_conf']
    if senha_nova != senha_conf:
        redirect('/new_senha')
    retorno = facade.pesquisa_aluno_nome_facade(nome)
    if valida_login_aluno(nome, senha):
        facade.aluno.update_aluno(retorno.id, nome, senha_nova)
        redirect('/user_menu')
    else:
        print("deu ruim tentando mudar a senha")
        redirect('/')

@route('/alterar_usuario_nome')
@view('alterar_usuario_nome')
def view_alterar_senha():
    return
@route('/new_nome_user',method='POST')
def controller_new_usuario_nome():

    nome = request.params['usuario']
    senha = request.params['senha']
    nome_novo= request.params['nome_novo']
    retorno = facade.pesquisa_aluno_nome_facade(nome)

    if valida_login_observador(nome, senha):
        facade.aluno.update_aluno(retorno.id, nome_novo, senha)
        create_cookie(nome_novo)
        redirect('/')
    else:
        print("deu ruim tentando mudar o usuario")
        redirect('/')
