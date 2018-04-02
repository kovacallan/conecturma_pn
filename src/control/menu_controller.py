from bottle import route, view, request, redirect
from facade.facade import Facade

""" Controle do index """

facade = Facade()


@route('/jogar_conecturma')
@view('jogar_conecturma')
def view_jogar_conecturma():
    """ pagina inicial apos login"""
    if request.get_cookie("login", secret='2524'):
        usuario = facade.pesquisa_aluno_facade(request.get_cookie("login", secret='2524'))
        avatar = facade.avatar_facade(usuario.id)
        if usuario.cor == 0:
            cor = 'default'
        else:
            cor = facade.pesquisa_item_facade(avatar['cor']).nome

        if usuario.rosto == 0:
            rosto = 'default'
        else:
            rosto = facade.pesquisa_item_facade(avatar['rosto']).nome
        if usuario.acessorio == 0:
            acessorio = 'default'
        else:
            acessorio = facade.pesquisa_item_facade(avatar['acessorio']).nome
        if usuario.corpo == 0:
            corpo = 'default'
        else:
            corpo = facade.pesquisa_item_facade(avatar['corpo']).nome

        avatar_pecas = {'cor': cor,
                        'rosto': rosto,
                        'acessorio': acessorio,
                        'corpo': corpo}
        return dict(usuario=usuario.nome, avatar = avatar_pecas)
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
    retorno = facade.pesquisa_aluno_facade(nome)
    if valida_login(nome, senha):
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
    retorno = facade.pesquisa_aluno_facade(nome)
    if valida_login(nome, senha):
        facade.aluno.update_aluno(retorno.id, nome_novo, senha)
        create_cookie(nome_novo)
        redirect('/')
    else:
        print("deu ruim tentando mudar o usuario")
        redirect('/')
