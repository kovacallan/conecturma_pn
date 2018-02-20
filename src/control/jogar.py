from bottle import route, run, view, get, request, error
import bottle
import os
from src.model.redis import *

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../view')
bottle.TEMPLATE_PATH.insert(0, view_path)

User = dict(name="eu", j1=0, j2=0)

#####--- Controle do index ---#####
@route('/')
@view('jogo')
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

#####--- Controle de cadastro de aluno ---#####
@route('/fazer_cadastro')
@view('cadastro')
def save_entry(entry):
    entry.save_to_db()  # Save entry to relational database, etc.

    ac.store(
        obj_id=entry.id,
        title=entry.title,
        obj_type='entry')


#####--- Controle de Turma ---#####
@route('/turma')
@view('turma')
def turma():
    return

####-- Create Turma --####
@route('/turma_cadastro')
@view('turma_cadastro')
def cadastrar_turma():
    return
@get('/cadastro_turma')
def create_turma():
    id = request.params['turma_id']
    turma = request.params['turma_nome']
    Turma.create(id=id, turma_nome=turma)
    print("{} = {}".format(id, turma))
    bottle.redirect('/turma')

####-- Read Turma --####
@route('/turma_read')
@view('turma_read')
def read_turma():
    turma_dic = {'id' : [] , 'turma_nome' : []}
    for turma in Turma.query(order_by = Turma.id):
        turma_dic['id'].append(turma.id)
        turma_dic['turma_nome'].append(turma.turma_nome)
    return dict(turma_id = turma_dic['id'], turma_nome = turma_dic['turma_nome'])

####-- Update Turma --####
@route('/turma_update')
@view('turma_update')
def update_turma():
    return


@error(404)
def error404(error):
    return 'Voce errou algum caminho , essa é uma pagina d erro , boa sorte'


run(host='localhost', port=8080, debug=True)