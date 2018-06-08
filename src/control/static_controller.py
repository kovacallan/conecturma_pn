from bottle import route, static_file

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
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(path, root='././jogo/GLOBAL')

@route('/GLOBAL/player')
def teste():
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(root='././jogo/GLOBAL/player')

@route('/ASSETS/<path:path>')
def teste2(path):
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(path, root='././jogo/ASSETS')

@route('/ASSETS_2/<path:path>')
def ASSETS_2(path):
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(path, root='././jogo/ASSETS_2')

@route('/UV1/<path:path>')
def teste2(path):
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(path, root='././jogo/UV1')
