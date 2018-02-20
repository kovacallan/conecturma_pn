from bottle import route, run, view, get, request, error
import bottle
import os
from src.model.redis import *

teste=User()
User = dict(name="eu", j1=0, j2=0)

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../view')
bottle.TEMPLATE_PATH.insert(0, view_path)

print(view_path)


@route('/')
@view('jogo')
def hello():
    return


@get('/jogos')
@view('ojogo')
def jogo():
    jogo = request.params['n1']
    print(jogo)
    return dict(nome_jogo=jogo)


@get('/ponto')
def ponto():
    jogo = request.params['jogo']
    ponto = int(request.params['ponto'])

    User[jogo] += ponto
    print("{} = {}".format(jogo, User[jogo]))

    bottle.redirect('/hello')


@get('/mostrar_score')
@view('score')
def mostrar_score():
    return dict(ponto_j_um=User['j1'], ponto_j_dois=User['j2'])


@route('/fazer_cadastro')
@view('cadastro')
def save_entry(entry):
    entry.save_to_db()  # Save entry to relational database, etc.

    ac.store(
        obj_id=entry.id,
        title=entry.title,
        obj_type='entry')

@error(404)
def error404(error):
    return 'Voce errou algum caminho , essa é uma pagina d erro , boa sorte'


run(host='localhost', port=8080, debug=True)