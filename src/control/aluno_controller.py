from bottle import route, view, get, request
from src.facade.facade import Facade
import bottle

facade = Facade()


""" Controle aluno """
@route('/aluno')
@view('aluno/aluno')
def aluno_read():
    return


""" Cadastro de aluno """
@route('/cadastro_aluno')
@view('aluno/aluno_cadastro')
def aluno():
    return


@route('/aluno_cadastro', method='POST')
def create_aluno():
    facade.CreateAlunoFacade(request.forms['aluno_nome'], request.forms['senha'])
    bottle.redirect('/')


""" Read de aluno"""
@route('/ler_aluno')
@view('aluno/aluno_read')
def read_aluno():
    usuarios = facade.ReadAlunoFacade()
    return dict(aluno_id=usuarios['id'], aluno_nome=usuarios['usuario_nome'], senha_aluno=usuarios['usuario_senha'])


"""Deletar aluno(usuario) """
@route('/deletar_aluno')
@view('delete_user')
def deletar():
    return


@get('/deletar_alunos')
def deletar_aluno():
    facade.DeleteAlunoFacade(request.params['id'])
    print(request.params['id'])
    bottle.redirect('/aluno')

"""Pesquisa ao aluno por nome """
