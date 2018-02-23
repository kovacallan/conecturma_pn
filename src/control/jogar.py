from bottle import route, run, view, get, request, error
import bottle
import os
from src.model.redis import *

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../view')
bottle.TEMPLATE_PATH.insert(0, view_path)

User = dict(name="eu", j1=0, j2=0)

@route('/')
@view('index')
def index():
    return

@route('/login', method = 'POST')
def login():
    login_obj = DbAluno()
    print('teste')
    nome  = request.params['usuario']
    senha = request.params['senha']

    retorno = login_obj.pesquisa_aluno(nome)

    if retorno:
        if retorno['senha'] == senha:
            bottle.redirect('/user_menu')
        else:
            bottle.redirect('/')
    else:
        bottle.redirect('/')

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


#####--- Controle aluno ---#####


@route('/aluno')
@view('aluno/aluno')
def aluno_read():
    return

#####--- Cadastro de aluno ---#####
@route('/cadastro_aluno')
@view('aluno/aluno_cadastro')
def aluno():
    return

@route('/aluno_cadastro', method = 'POST')
def create_aluno():
    aluno_obj = DbAluno()
    nome  = request.forms['aluno_nome']
    senha = request.forms['senha']

    aluno_obj.create_aluno(nome, senha)

    bottle.redirect('/')

######--- Read de aluno---#####
@route('/ler_aluno')
@view('aluno/aluno_read')
def read_aluno():
    aluno_dic = {'id' : [] , 'aluno_nome' : [] , 'senha_aluno' : [] }

    for aluno in DbAluno.query(order_by = DbAluno.aluno_nome):
        aluno_dic['id'].append(aluno.id)
        aluno_dic['aluno_nome'].append(aluno.aluno_nome)
        aluno_dic['senha_aluno'].append(aluno.senha_aluno)

    return dict(aluno_id = aluno_dic['id'], aluno_nome = aluno_dic['aluno_nome'], senha_aluno= aluno_dic['senha_aluno'])

####-- Deletar aluno(usuario) --####
@route('/deletar_aluno')
@view('delete_user')
def deletar():
    return

@get('/deletar_alunos')
def deletar_aluno():
        id_al = request.params['id']
        aluno_obj = DbAluno(id=id_al)
        print(id)
        aluno_obj.delete()

        bottle.redirect('/')

####--Pesquisa ao aluno por nome --####

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




run(host='localhost', port=8080, debug=True)