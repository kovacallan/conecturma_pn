from bottle import view, get, request, redirect, route, BaseResponse, post

from facade.facade import Facade
from model.aluno_model import DbAluno

facade = Facade()

"""Controle do jogo """


@get('/jogos')
@view('ojogo')
def jogo():
    """
    jogo que recebe o parâmetro de qual botão foi clicado e armazena a quantidade de acertos
    :return: nome do jogo
    """
    if True or request.get_cookie("login", secret='2524'):
        jogo = request.params['n1']
        return dict(nome_jogo=jogo)
    else:
        redirect('/')


""" Controle do score """


@get('/ponto')
def ponto():
    """
    Recebe o nome do botão que o jogador clicou para o jogo o valor de 1 em caso de acerto
    incrementa nos pontos em cada jogo e manda um clique para ser acrescentado a cliques totais , para fins estatisticos

    :return:ao termino do jogo volta a pagina do menu
    """

    jogo = request.params['jogo']
    ponto = int(request.params['ponto'])
    usuario = request.get_cookie("login", secret="2524")


    facade.ponto_jogo_facade(usuario, jogo, ponto)
    redirect('/')

    """ redirect('/jogos', BaseResponse.add_header(jogo=jogo ,value=jogo))"""


"""Controle que mostra o score """


@get('/mostrar_score')
@view('score')
def mostrar_score():
    """
Mostra a pontuação do jogador, a quantidade de vidas ,a quantidade de moedas e o desempenho em cada jogo

:return: O numero de acertos , vidas , moedas e o desempenho do jogador em cada jogo (porcentagem de acertos)
"""

    ponto = facade.pesquisa_aluno_facade(request.get_cookie("login", secret='2524'))
    return dict(ponto_j_um=ponto.pontos_j1, ponto_j_dois=ponto.pontos_j2, pontos_de_vida=ponto.pontos_de_vida,
                pontos_moedas=ponto.pontos_de_moedas, desempenho_j1=ponto.desempenho_aluno_j1,
                desempenho_j2=ponto.desempenho_aluno_j2)
