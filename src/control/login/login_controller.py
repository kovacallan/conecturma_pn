from bottle import route, view, request, redirect, response
from facade.aluno_facade import AlunoFacade

facade = AlunoFacade()

@route('/')
@view('index')
def view_login_index():
    if request.get_cookie("login", secret='2524'):
        redirect('/user_menu')
    elif request.get_cookie("login", secret='2525'):
        redirect('/gestao_aprendizagem')
    else:
        return

@route('/formulario_cadastro')
@view('formulario_cadastro')
def view_login_cadastro():
    return

@route('/cadastro', method='POST')
def controller_login_cadastro():
    facade.create_aluno_facade(request.params['aluno_nome'], request.params['senha'])
    redirect('/')

@route('/sair')
def controller_login_sair():
    response.delete_cookie("login")
    redirect('/')
