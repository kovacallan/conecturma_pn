from bottle import route, template

@route('/UV1/<path:path>')
def av1_mapa(path):
    return template('jogo/UV1/{}'.format(path))

@route('/UV1/UV1AV1/UV1AV1MAPA/')
def av1_mapa2():
    return template('jogo/UV1/UV1AV1/UV1AV1MAPA/index.html')

@route('/UV1/UV1AV1/UV1AV1UD1/UV1AV1UD1MAPA/')
def av1_mapa3():
    return template('jogo/UV1/UV1AV1/UV1AV1UD1/UV1AV1UD1MAPA/index.html')
