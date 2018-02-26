from bottle import run

import bottle
import os


import src.control.aluno_controller
import src.control.login_controller
import src.control.jogo_controller
import src.control.turma_controller
import src.control.aluno_controller

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'view')
bottle.TEMPLATE_PATH.insert(0, view_path)

run(host='localhost', port=8088, debug=True)
