from bottle import route, view, get, request
from src.model.aluno_model import *
import bottle

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
