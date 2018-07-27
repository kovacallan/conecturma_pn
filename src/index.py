from bottle import default_app, run, template, route
from control.static import *
from control.filtro_usuario_controller import *
from control.static_game import *
from control.route import *
def main():
    import bottle
    import os

    view_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'view')
    bottle.TEMPLATE_PATH.insert(0, view_path)

    application = default_app()

    run(host='0.0.0.0', port=80, server='gunicorn', workers=4)

@route('/error403')
def error403():
    return template('error403.tpl')


if __name__ == '__main__':
    main()
