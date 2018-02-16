from bottle import route, run, view, get, request
import bottle
import os

User = dict(name = "eu",j1 = 0,j2 = 0)

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../view')
bottle.TEMPLATE_PATH.insert(0, view_path)

print(view_path)
@route('/hello')
@view('jogo')

def hello():
    return

@get('/jogos')
@view('ojogo')
def jogo():
    jogo = request.params['n1']
    print(jogo)
    return dict(nome_jogo = jogo)

@get('/ponto')
def ponto():
    jogo = request.params['jogo']
    ponto = int(request.params['ponto'])

    User[jogo] += ponto
    print("{} = {}" .format(jogo, User[jogo]))

    bottle.redirect('/hello')

@get('/mostrar_score')
@view('score')
def mostrar_score():

    return dict(ponto_j_um = User[j1],ponto_j_dois = User[j2] )

run(host='localhost', port=8080, debug=True)