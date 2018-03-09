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
        if avatar:
            avatar_pecas = {'cor': facade.PesquisaItemFacade(avatar['cor']),
                            'rosto': facade.PesquisaItemFacade(avatar['rosto']),
                            'acessorio': facade.PesquisaItemFacade(avatar['acessorio']),
                            'corpo': facade.PesquisaItemFacade(avatar['corpo'])}
        else:
            avatar = False
        return dict(usuario=usuario.usuario_nome, avatar=avatar_pecas)
    else:
        redirect('/')
