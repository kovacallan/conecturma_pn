from bottle import route, view, request, redirect
from facade.facade import Facade

""" Controle do index """

facade = Facade()


@route('/user_menu')
@view('menu')
def hello():
    """ pagina inicial apos login"""
    if request.get_cookie("login", secret='2524'):
        usuario = facade.PesquisaAlunoFacade(request.get_cookie("login", secret='2524'))
        avatar = facade.avatar_facade(usuario.id)
        if usuario.cor == 0:
            cor = 'default'
        else:
            cor = facade.PesquisaItemFacade(avatar['cor']).nome_item

        if usuario.rosto == 0:
            rosto = 'default'
        else:
            rosto = facade.PesquisaItemFacade(avatar['rosto']).nome_item
        if usuario.acessorio == 0:
            acessorio = 'default'
        else:
            acessorio = facade.PesquisaItemFacade(avatar['acessorio']).nome_item
        if usuario.corpo == 0:
            corpo = 'default'
        else:
            corpo = facade.PesquisaItemFacade(avatar['corpo']).nome_item

        avatar_pecas = {'cor': cor,
                        'rosto': rosto,
                        'acessorio': acessorio,
                        'corpo': corpo}
        return dict(usuario=usuario.usuario_nome, avatar = avatar_pecas)
    else:
        redirect('/')
