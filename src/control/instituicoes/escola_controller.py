from bottle import *
from facade.facade_main import Facade



facade = Facade()


@route('/escola')
@view('escola/index')
def view_escola_index():
    """
    view inicial de escola, mostrando as escolas cadastradas no sistema
    usa o metodo: controller_escola_read :interno:
    :return:dicionario com os valores da escola a serem mostrados
    """
    escola = controller_escola_read()
    return dict(escola=escola)


@route('/escola/cadastro')
@view('escola/create_escola')
def view_escola_cadastro():

    observador = facade.search_observador_facade(request.get_cookie("login", secret='2525'))
    if observador['tipo'] == '1':
        rede = facade.search_rede_id_facade(int(observador['vinculo_rede']))
        return dict(rede=rede, observador_tipo = observador['tipo'])
    elif observador['tipo'] == '0':
        rede = facade.read_rede_facade()
        return dict(rede=rede, observador_tipo=observador['tipo'])


@route('/escola/read_escola')
@view('escola/read_escola')
def view_escola_read():
    """
    Chama o metodo controller_escola_read , para colocar todos os parametros q serao mostrados de escola
    dentro de um dicionario
    metodo usado: controller_escola_read   :interno:
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
    escolas = facade.search_escola_facade(nome)
    return template('escola/update_escola', id=escolas['id'], nome=escolas['nome'], numero=escolas['numero'],
                    estado=escolas['estado'], cidade=['cidade'],
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
    telefone = request.params['telefone']
    cep = request.params['cep']
    estado = request.params['estado']
    uf = request.params['uf']
    numero = request.params['numero']
    rede_pertencente = request.params['rede']

    if filtro_cadastro(nome, cep, numero, telefone, estado, uf):
        facade.create_escola_facade(nome=nome, cep=cep, numero=numero, telefone=telefone, estado=estado, uf=uf,
                                    vinculo_rede=rede_pertencente)
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
    if escola is None:
        return None
    else:
        for e in escola:
            if int(e['vinculo_rede']) > 0:
                print("BB {} ".format(int(e['vinculo_rede'])))
                rede = facade.search_rede_id_facade(int(e['vinculo_rede']))
                e['vinculo_rede'] = rede['nome']
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


def filtro_cadastro(nome, cep, numero, telefone, estado, uf):
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

    return True
