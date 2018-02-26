from bottle import route,view, get, request
from src.model.redis import *
import bottle
#####--- Controle de Turma ---#####
@route('/turma')
@view('turma/turma')
def turma():
    return

####-- Create Turma --####
@route('/turma_cadastro')
@view('turma/turma_cadastro')
def cadastrar_turma():
    return

@get('/cadastro_turma')
def create_turma():

    turma_obj = DbTurma()

    turma = request.params['turma_nome']

    turma_obj.create_turma(turma)

    bottle.redirect('/turma')

####-- Read Turma --####
@route('/turma_read')
@view('turma/turma_read')
def read_turma():
    turma_obj = DbTurma()

    turma_dic = {'id' : [] , 'turma_nome' : []}

    for turma in turma_obj.read_turma():
        turma_dic['id'].append(turma.id)
        turma_dic['turma_nome'].append(turma.turma_nome)

    return dict(turma_id = turma_dic['id'], turma_nome = turma_dic['turma_nome'])

####-- Update Turma --####
@route('/turma_update')
@view('turma/turma_update')
def update_turma():
    return
