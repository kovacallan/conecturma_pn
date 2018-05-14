from bottle import route, view, request, redirect, response
from facade.facade_main import Facade

facade = Facade()

@route('/')
@view('login/index')
def view_login_index():
    """
    Cria um cookie com base no usuario que loga , sendo diferentes os cookies para o aluno e para os observadores
    :return:
    """
    observador = facade.search_observador_facade(request.get_cookie("login", secret='2526'))

    if request.get_cookie("login", secret='2524'):
        redirect('/jogar_conecturma')
    elif request.get_cookie("login", secret='2525') and observador['tipo']!='0':
        redirect('/gestao_aprendizagem')
    elif request.get_cookie("login", secret='2525') and observador['tipo']=='0':
        redirect('/pag_administrador')
    else:
        return

@route('/sair')
def controller_login_sair():
    """
    Deleta o cookie
    :return:
    """
    response.delete_cookie("login")
    redirect('/')
