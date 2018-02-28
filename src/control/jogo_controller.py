from bottle import route, view, get, request

from src.model.redis import *

""" Controle do index """


@route('/user_menu')
@view('menu')
def hello():
    """ pagina inicial após login"""
    if request.get_cookie("teste", secret='2524'):
        return
    else:
        bottle.redirect('/')


"""Controle do jogo """


@get('/jogos')
@view('ojogo')
def jogo():
    """
    jogo que recebe o parametro de qual botao foi clicado e armazena a quatidade de acertos
    :return: nome do jogo
    """
    jogo = request.params['n1']
    print(jogo)
    return dict(nome_jogo=jogo)


""" Controle do score """


@get('/ponto')
def ponto():
    """
    pega o botão que o jogador clicou e incrementa os pontos, em caso de acerto
    :return:ao termino do jogo volta a pagina do menu
    """

    jogo = request.params['jogo']
    ponto = int(request.params['ponto'])
    DbUsuario[jogo] += ponto
    print("{} = {}".format(jogo, DbUsuario[jogo]))

    bottle.redirect('/')


"""Controle que mostra o score """


@get('/mostrar_score')
@view('score')
def mostrar_score():
    """
    mostra a pontuação
    :return: O numero de acertos de cada jogo
    """
    return dict(ponto_j_um=DbUsuario['j1'], ponto_j_dois=DbUsuario['j2'])
