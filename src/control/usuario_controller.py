from bottle import route, view, get, request
from facade.facade import *
import bottle

facade = Facade()

""" Controle aluno """


@route('/aluno')
@view('aluno/aluno')
def aluno_read():
    if request.get_cookie("teste", secret='2524'):
        return
    else:
        bottle.redirect('/')


""" Cadastro de aluno """


@route('/cadastro_aluno')
@view('aluno/aluno_cadastro')
def aluno():
    if request.get_cookie("teste", secret='2524'):
        return
    else:
        bottle.redirect('/')


@route('/aluno_cadastro', method='POST')
def create_aluno():
    facade.CreateAlunoFacade(request.forms['aluno_nome'], request.forms['senha'])
    bottle.redirect('/aluno')


""" Read de aluno"""


@route('/ler_aluno')
@view('aluno/aluno_read')
def read_aluno():

    if request.get_cookie("teste", secret='2524'):
        usuarios = facade.ReadAlunoFacade()
        print(usuarios)
        return dict(aluno_id=usuarios['id'], aluno_matricula=usuarios['matricula'], aluno_nome=usuarios['usuario_nome'],
                    senha_aluno=usuarios['usuario_senha'])
    else:
        bottle.redirect('/')



"""Deletar aluno(usuario) """


@get('/deletar_alunos')
def deletar_aluno():
    facade.DeleteAlunoFacade(request.params['id'])
    print(request.params['id'])
    bottle.redirect('/aluno')


"""Pesquisa ao aluno por nome """
