from bottle import route,view, request, redirect, response
from facade.historico_facade import HistoricoFacade

facade = HistoricoFacade()

@route('/historico')
@view('historico_login')
def view_historico_login():
    historico = controller_historico_login()
    return dict(historico = historico)

def controller_historico_login():
    historico = facade.read_historico_facade()
    return historico