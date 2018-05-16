from bottle import default_app,run

from control.static_controller import *

from control.area_aluno_controller import *

from control.b_observadores_controller import *

from control.c_administrador_controller import *

from control.login_controller import *

from control.login.login_observador_controller import *




import bottle
import os

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'view')
bottle.TEMPLATE_PATH.insert(0, view_path)


application = default_app()

if __name__ == '__main__':
    run(host='localhost', port=8080, reloader=True ,debug=True)
