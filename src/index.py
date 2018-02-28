from bottle import run
import os

from control.static_controller import *
from control.menu_controller import *
from control.usuario_controller import *
from control.login_controller import *
from control.jogo_controller import *
from control.turma_controller import *


view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'view')
bottle.TEMPLATE_PATH.insert(0, view_path)



run(host='localhost', port=8080, debug=True)
