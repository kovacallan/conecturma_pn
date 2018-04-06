from bottle import route, static_file

@route('/static/<filename>')
def send_static(filename):
    """
    ligaçao com o arquivo css
    :param filename:o caminho para onde esta o css
    :return:
    """
    return static_file(filename, root='././view/app/css')