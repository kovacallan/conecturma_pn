from bottle import run, default_app
from control.static_controller import *
from control.menu_controller import *
from control.aluno_controller import *
from control.observador_controller import *
from control.login_controller import *
from control.jogo_controller import *
from control.turma_controller import *
from control.loja_controller import *
from control.rede_controller import *
import bottle
import os

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'view')
bottle.TEMPLATE_PATH.insert(0, view_path)


application = default_app()

if __name__ == '__main__':
    run(host='localhost', port=8080, reloader=True ,debug=True)
