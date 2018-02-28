from bottle import route,view, request

""" Controle do index """
@route('/user_menu')
@view('menu')
def hello():
    """ pagina inicial apos login"""
    if request.get_cookie("teste", secret='2524'):
        return
    else:
        bottle.redirect('/')
