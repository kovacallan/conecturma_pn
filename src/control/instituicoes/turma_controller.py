from bottle import route, view, get, request, redirect
from facade.turma_facade import TurmaFacade
from facade.escola_facade import EscolaFacade
from facade.observador_facade import ObservadorFacade

turma_facade = TurmaFacade()
escola_facade = EscolaFacade()
observador_facade = ObservadorFacade()
""" Controle de Turma """


@route('/turma')
@view('turma/turma')
def view_turma():
    """
    Pagina inicial de turmas e q mostra as turmas ja cadastradas
    metodos utilizados : controller_read_ turma :interno dessa pagina:
    :return: dicionario com os parametros da turma a serem mostrados
    """
    turmas = controller_read_turma()
    return dict(turma=turmas)


""" Create Turma """


@route('/turma/turma_cadastro')
@view('turma/turma_cadastro')
def view_cadastrar_turma():
    """
    Pagina de cadastro de turma , mostra as escolas ja cadastradas no banco de dados
    metodos usados: read_escola_facade
    :return:o dicionario com as escolas
    """

    observador = observador_facade.search_observador_facade(request.get_cookie("login", secret='2525'))
    if observador['tipo'] == '2':
        escola = escola_facade.search_escola_id_facade(int(observador['vinculo_escola']))
        return dict(escolas=escola, observador_tipo = observador['tipo'])
    elif observador['tipo'] == '1':
        escola = []
        escolas = escola_facade.read_escola_facade()
        for e in escolas:
            if e['vinculo_rede'] is observador['vinculo_rede']:
                escola.append(e)

        return dict(escolas=escola, observador_tipo = observador['tipo'])
    elif observador['tipo'] == '0':
        escola = escola_facade.read_escola_facade()
        return dict(escolas=escola, observador_tipo=observador['tipo'])


@route('/turma/cadastro_turma', method='POST')
def controller_create_turma():
    """
    Pagina para chamar a funçao create_turma , usando nome , serie e escola
    metodos usados: create_turma_facade
    :return: cria uma entrada no banco de dados da turma criada
    """
    turma = request.forms['turma_nome']
    serie = request.forms['serie']
    escola = request.forms['escola']
    turma_facade.create_turma_facade(nome=turma, login=request.get_cookie("login", secret='2524'), serie=serie, escola=escola)

    redirect('/turma')

def controller_read_turma():
    """
    Direciona para a pagina que mostra a turma e nomeia as series
    metodos usados: read_turma_facade
    :return: a entrada de dicionario que contem o id e o turma_nome
    """
    turmas = turma_facade.read_turma_facade()
    if turmas == None:
        return None
    else:

        turma = []
        for t in turmas:
            escola = escola_facade.search_escola_id_facade(int(t['escola']))
            t['escola'] = escola['nome']

            if t['serie'] == 0:
                t['serie'] = "Pré-escola"
            elif t['serie'] == 1:
                t['serie'] = "1ª Ano"
            elif t['serie'] == 2:
                t['serie'] = "2ª Ano"
            elif t['serie'] == 3:
                t['serie'] = "3ª Ano"
            elif t['serie'] == 4:
                t['serie'] = "4ª Ano"
            elif t['serie'] == 5:
                t['serie'] = "5ª Ano"
            turma.append(t)

        return turma


"""Turma Delete"""


@get('/deletar_turma')
def deletar_turma():
    """
    nao implementado
    :return:
    """
    turma_facade.delete_turma_facade(request.params['id'])
    redirect('/turma')
