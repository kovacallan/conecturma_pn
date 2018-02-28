from bottle import route, view, get, request, redirect
from src.facade.facade import Facade

facade = Facade()


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


@route('/aluno_cadastro', method='POST')
def create_aluno():
    """
    Direcionamento a pagina para criar aluno buscando , na tpl os parametros usuario , senha e matricula
    :return: cria o aluno e volta para a pagina geral aluno
    """
    facade.CreateAlunoFacade(request.forms['aluno_nome'], request.forms['senha'])
    redirect('/')


######--- Read de aluno---#####
@route('/ler_aluno')
@view('aluno/aluno_read')
def read_aluno():
    """
    Direciona para a funçao ReadAlunoFacade
    :return: o dicionario com a id , usuario_nome e senha_aluno para ser usado pela tpl
    """
    usuarios = facade.ReadAlunoFacade()
    return dict(aluno_id=usuarios['id'],aluno_matricula = usuarios['matricula'], aluno_nome=usuarios['usuario_nome'], senha_aluno=usuarios['usuario_senha'])


####-- Deletar aluno(usuario) --####
@get('/deletar_alunos')
def deletar_aluno():
    """
    Direciona a funçao DeleteAlunoFacade para a pagina tpl
    :return: Deleta a entrada de dicionario e retorna a pagina geral aluno
    """
    facade.DeleteAlunoFacade(request.params['id'])
    redirect('/aluno')

####--Pesquisa ao aluno por nome --####
