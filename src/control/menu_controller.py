from bottle import route,view, request,redirect

""" Controle do index """
@route('/user_menu')
@view('menu')
def hello():
    """ pagina inicial apos login"""
    if request.get_cookie("login", secret='2524'):
        return dict(usuario = request.get_cookie("login", secret='2524'))
    else:
        redirect('/')
