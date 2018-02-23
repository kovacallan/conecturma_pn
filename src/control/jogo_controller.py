from bottle import route,view, get, request
import bottle
#####--- Controle do index ---#####
@route('/user_menu')
@view('menu')
def hello():
    return

#####--- Controle do jogo ---#####
@get('/jogos')
@view('ojogo')
def jogo():
    jogo = request.params['n1']
    print(jogo)
    return dict(nome_jogo=jogo)

#####--- Controle do score ---#####
@get('/ponto')
def ponto():
    jogo = request.params['jogo']
    ponto = int(request.params['ponto'])
    User[jogo] += ponto
    print("{} = {}".format(jogo, User[jogo]))

    bottle.redirect('/')

#####--- Controle que mostra o score ---#####
@get('/mostrar_score')
@view('score')
def mostrar_score():
    return dict(ponto_j_um=User['j1'], ponto_j_dois=User['j2'])
