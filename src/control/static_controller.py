from bottle import route, static_file,template

@route('/static/<filename>')
def css(filename):
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(filename, root='././view/app/css')

@route('/static/js/<filename>')
def js(filename):
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(filename, root='././view/app/js')

@route('/GLOBAL/<path:path>')
def teste(path):
    print('global')
    return static_file(path, root='././jogo/GLOBAL')

# @route('/UV1/UV1AV1/UV1AV1MAPA/')
# def av1_mapa2():
#     print('mapa2')
#     return template('jogo/UV1/UV1AV1/UV1AV1MAPA/index.html')

# @route('/GLOBAL/player')
# def teste():
#     """
#     ligaçao com o arquivo css
#     :param filename:o caminho para onde esta o css
#     :return:
#     """
#     return static_file(root='././jogo/GLOBAL/player')

@route('/ASSETS/<path:path>')
def teste2(path):
    print('assets')
    return static_file(path, root='././jogo/ASSETS')

@route('/UV1/UV1MAPA/<path:path>')
def teste2(path):
    print('aqui')
    return static_file(path, root='././jogo/UV1/UV1MAPA')

@route('/UV1/UV1AV1/UV1AV1MAPA/<path:path>')
def teste(path):
    print('hmm')
    return static_file(path, root='././jogo/UV1/UV1AV1/UV1AV1MAPA/')
