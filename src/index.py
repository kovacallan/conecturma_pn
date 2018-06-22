from bottle import default_app,run,template
from control.static_controller import *
from control.ambiente_de_aprendizagem_controller import *
from control.ambiente_de_gestao_de_aprendizagem_controller import *
from control.ambiente_administrativo_controller import *
from control.filtro_usuario_controller import *
from control.rotas import *
from control.login_controller import *
from facade.facade_main import *

import bottle
import os



view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'view')
bottle.TEMPLATE_PATH.insert(0, view_path)

application = default_app()
@route('/error403')
def error403():
    return template('error403.tpl')

if __name__ == '__main__':
    run(host='localhost', port=8080, reloader=False ,debug=True)
