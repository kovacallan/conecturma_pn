from bottle import route,view, request, redirect, response
from facade.historico_facade import HistoricoFacade

facade = HistoricoFacade()

@route('/historico')
@view('historico_login')
def view_historico_login():
    """
    pagina vista pelo usuario com o historico de loguin , ainda nao discriminado
    usa metodo : controller_historico_login()
    :return:o dicionario contendo o historico dos usuarios
    """
    historico = controller_historico_login()
    return dict(historico = historico)

def controller_historico_login():
    """
    metodo para pegar o historico
    :return: o metodo de read_historico_facade() armazenado em historico
    """
    historico = facade.read_historico_facade()
    return historico