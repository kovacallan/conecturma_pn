from bottle import route, view, request, redirect
from facade.facade import Facade

""" Controle do index """

facade = Facade()


@route('/user_menu')
@view('menu')
def hello():
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
        return dict(usuario=usuario.usuario_nome, avatar = avatar_pecas)
    else:
        redirect('/')
