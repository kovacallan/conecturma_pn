from bottle import route, view, get, request, redirect
from facade.medalha_facade import MedalhaFacade

facade = MedalhaFacade()

""" Controle de medalha """


@route('/medalha')
@view('medalha/medalha')
def medalha():
    """pagina inicial de medalha"""
    return

""" Create medalha """


@route('/medalha_cadastro')
@view('observador/medalha_cadastro.tpl')
def cadastrar_medalha():
    """
    pagina de cadastro de medalha
    :return:
    """
    return


@get('/create_medalha')
def controller_medalha_cadastro():

    nome = request.params['nome']
    facade.create_medalha_facade(nome)
    redirect('/gestao_aprendizagem')

""" Read medalha """


@route('/ler_medalha')
@view('observador/read_medalhas.tpl')
def read_de_medalha():
    medalhas = []

    for medalha in facade.read_medalha_facade():
        medalhas.append(medalha)

    return dict(medalhas=medalhas)

    # medalhas = facade.read_medalha_facade()
    #
    # medalhais = [(medalha['id'], medalha['nome']) for medalha in medalhas]
    # return dict(medalha=medalhais)

"""DELETE MEDALHA"""


@get('/delete_medalha')
def deletar_turma():
    """
    Pega os ids das medalhas e deleta
    :return:
    """
    facade.delete_medalha_facade(request.params['id'])
    redirect('/')
