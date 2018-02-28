from bottle import route,static_file

@route('/static/<filename>')
def send_static(filename):
    """
    ligaçao com o arquivo css
    :param filename:
    :return:
    """
    return static_file(filename, root='././view/app/css')