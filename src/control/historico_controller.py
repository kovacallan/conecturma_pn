from bottle import route,view, request, redirect, response
from facade.facade import Facade

facade = Facade()

@route('/historico')
@view('historico_login')
def view_historico_login():
    historico = controller_historico_login()
    return dict(historico = historico)

def controller_historico_login():
    historico = facade.read_historico_facade()
    return historico