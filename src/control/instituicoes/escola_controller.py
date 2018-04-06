from bottle import *
from facade.escola_facade import EscolaFacade
from facade.rede_facade import RedeFacade

facade = EscolaFacade()
rede_facade = RedeFacade()

@route('/escola')
@view('escola/index')
def view_escola_index():
    """
    view inicial de escola
    :return:
    """
    escola = controller_escola_read()
    return dict(escola=escola)



@route('/escola/cadastro')
@view('escola/create_escola')
def view_escola_cadastro():
    rede = rede_facade.read_rede_facade()
    return dict(rede = rede)



@route('/escola/read_escola')
@view('escola/read_escola')
def view_escola_read():
    """
    chama o metodo controller_escola_read , para colocar tudo dentro de um dicionario
    :return: o dicionario
    """
    escola = controller_escola_read()
    return dict(escola=escola)


@get('/escola/editar')
def view_escola_update():
    """
    Edita os atributos de escola , recebendo o parametro de nome da escola
    metodos usados : pesquisa_escola_facade
    :return: o template referente a pagina de update
    """
    nome = request.params['nome']
    escolas = facade.pesquisa_escola_facade(nome)
    return template('escola/update_escola', id=escolas['id'], nome=escolas['nome'], numero=escolas['numero'],estado=escolas['estado'],cidade=['cidade'],
                    telefone=escolas['telefone'], rua=escolas['rua'], rede_pertencente=escolas['rede_pertencente'],
                    cod_identificacao=escolas['cod_identificacao'])


@get('/escola/create_escola')
def controller_escola_cadastro():
    """
    Metodo de cadastrar escola , com os atributos que a escola recebe
    usa os metodos : filtro_cadastro(do proprio controller) e create_escola_facade
    :return:
    """
    nome = request.params['nome']
    rua = request.params['rua']
    numero = request.params['numero']
    telefone = request.params['telefone']
    estado = request.params['estado']
    cidade = request.params['cidade']
    rede_pertencente = request.params['rede']
    cod_identificacao = request.params['cod_id']

    if filtro_cadastro(nome, rua, numero, telefone, estado, cidade, cod_identificacao):
        facade.create_escola_facade(nome, rua, numero, telefone, estado, cidade, rede_pertencente, cod_identificacao)
        redirect('/escola/cadastro')
    else:
        print("Erro para salvar")


def controller_escola_read():
    """
    Cria uma lista , coloca as escolas do banco na lista para mostrar na tela
    metodos usados: read_escola_facade
    :return: a lista de escolas q serao mostradas
    """
    escolas = []
    escola = facade.read_escola_facade()
    for e in escola:
        if int(e['rede']) > 0:
            rede = rede_facade.search_rede_id_facade(e['rede'])
            e['rede'] = rede['nome']
        escolas.append(e)
    return escolas


@route('/escola/update_escola', method='POST')
def controller_escola_update():
    """
    modifica os dados da escola
    :return:
    """
    facade.update_escola_facade(id=request.params['id'], nome=request.params['nome'], rua=request.params['rua'],
                                  numero=request.params['numero'],
                                  telefone=request.params['telefone'], estado=request.params['estado'],
                                  cidade=request.params['cidade'], rede_pertencente=request.params['rede_pertencente'],
                                  cod_identificacao=request.params['cod_identificacao'])
    redirect('/escola/read_escola')


def filtro_cadastro(nome, telefone, rua, numero, estado, cidade, cod_identificacao):
    """
    impede que os parametros do cadastro sejam postados vazios
    :param nome: nome da escola
    :param telefone: telefone da escola
    :param rua: rua em que reside a escola
    :param numero: numero da casa da escola(na rua)
    :param estado: estado da escola
    :param cidade: cidade da escola
    :param cod_identificacao: codigo identificador da escola , no cadastro do governo
    :return: false se alguns desses parametros vier vazio e true se todos vierem preenchidos
    """
    if nome == "":
        return False
    elif telefone == "":
        return False
    elif rua == "":
        return False
    elif numero == "":
        return False
    elif estado == "":
        return False
    elif cidade == "":
        return False
    elif cod_identificacao == "":
        return False
    else:
        return True
