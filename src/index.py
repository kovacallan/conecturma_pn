from bottle import default_app
from control.static_controller import *
from control.menu_controller import *
from control.usuarios.aluno_controller import *
from control.usuarios.observador_controller import *
from control.usuarios.diretor_controller import *
from control.usuarios.professor_controller import *
from control.usuarios.gestor_controller import *
from control.jogo_controller import *
from control.instituicoes.turma_controller import *
from control.loja_controller import *
from control.instituicoes.escola_controller import *
from control.instituicoes.rede_controller import *
from control.historico_controller import *
from control.login.login_controller import *
from control.login.login_observador_controller import *
from control.login.login_aluno_controller import *
import bottle
import os

view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'view')
bottle.TEMPLATE_PATH.insert(0, view_path)


application = default_app()

if __name__ == '__main__':
    run(host='localhost', port=8080, reloader=True ,debug=True)
