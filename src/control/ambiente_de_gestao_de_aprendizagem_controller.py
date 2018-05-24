from bottle import route, view, request, redirect, get, template
from facade.facade_main import Facade
from control.classes.permissao import permissao, usuario_logado, permissao
from control.dicionarios import *
from random import randrange

facade=Facade()

@route('/gestao_aprendizagem')
@permissao('responsavel_varejo')
@view('caminho_observador/gestao_aprendizagem')
def view_gestao_aprendizagem():
    observador = usuario_logado()
    return dict(usuario = observador['nome'], tipo=observador['tipo'])

@route('/gestao_aprendizagem/usuario/redirect_cadastro')
@permissao('professor')
def controller_redirect_cadastro():
    tipo_usuario = request.params['tipo_usuario']
    if tipo_usuario is '1':
        redirect('/observador/cadastro?tipo_observador=1')
    elif tipo_usuario is '2':
        redirect('/observador/cadastro?tipo_observador=2')
    elif tipo_usuario is '3':
        redirect('/observador/cadastro?tipo_observador=3')
    elif tipo_usuario is '6':
        redirect('/aluno/cadastro_aluno')
    else:
        redirect('/gestao_aprendizagem/usuario')

@route('/gestao_aprendizagem/usuario')
@permissao('professor')
@view('usuario/index')
def view_usuario_index():
    """
    mostra todos os usuarios , escolas e redes cadastradas
    :return:
    """
    observador = usuario_logado()
    usuario = controller_index_usuario(observador)
    rede, escola, turma = controller_filtro_opcoes(observador=observador)
    return dict(observador_tipo=observador['tipo'], usuarios=usuario, redes=rede, escolas=escola, turmas=turma)

@permissao('professor')
def controller_index_usuario(observador):
    if observador['tipo'] == TIPO_USUARIOS['administrador']:
        return lista_de_usuarios_caso_observador_for_administrador()
    elif observador['tipo'] == TIPO_USUARIOS['professor']:
        return lista_de_usuarios_caso_observador_for_professor(observador['vinculo_turma'])
    elif observador['tipo'] == TIPO_USUARIOS['diretor']:
        return lista_de_usuarios_caso_observador_for_diretor(observador['vinculo_escola'])
    elif observador['tipo'] == TIPO_USUARIOS['gestor']:
        return lista_de_usuarios_caso_observador_for_gestor(observador['vinculo_rede'])

def lista_de_usuarios_caso_observador_for_administrador():
    usuario = []
    aluno = facade.read_aluno_facade()
    observador = facade.read_observador_facade()
    for a in aluno:
        a['email']=''
        a['vinculo_rede']=get_nome_rede(a['vinculo_rede'])
        a['vinculo_escola']=get_nome_escola(a['vinculo_escola'])
        a['vinculo_turma']=get_nome_turma(a['vinculo_turma'])
        a['tipo'] = TIPO_USUARIOS_ID[a['tipo']]
        usuario.append(a)

    for o in observador:
        if o['tipo'] != '0':
            o['vinculo_rede'] = get_nome_rede(o['vinculo_rede'])
            o['vinculo_escola'] = get_nome_escola(o['vinculo_escola'])
            o['vinculo_turma'] = get_nome_turma(o['vinculo_turma'])
            o['tipo'] = TIPO_USUARIOS_ID[o['tipo']]
            usuario.append(o)
    return usuario

def lista_de_usuarios_caso_observador_for_gestor(vinculo_rede):
    usuario = []

    aluno = facade.search_aluno_by_rede_facade(vinculo_rede)
    observador = facade.search_observador_by_rede_facade(vinculo_escola=vinculo_rede)

    for a in aluno:
        a['email'] = ""
        a['vinculo_rede'] = get_nome_rede(a['vinculo_rede'])
        a['vinculo_escola'] = get_nome_escola(a['vinculo_escola'])
        a['vinculo_turma'] = get_nome_turma(a['vinculo_turma'])
        a['tipo'] = TIPO_USUARIOS_ID[a['tipo']]
        usuario.append(a)
    for o in observador:
        if o['tipo'] != '0':
            o['vinculo_rede'] = get_nome_rede(o['vinculo_rede'])
            o['vinculo_escola'] = get_nome_escola(o['vinculo_escola'])
            o['vinculo_turma'] = get_nome_turma(o['vinculo_turma'])
            o['tipo'] = TIPO_USUARIOS_ID[o['tipo']]
            usuario.append(o)
    return usuario

def lista_de_usuarios_caso_observador_for_diretor(vinculo_escola):
    usuario = []
    aluno = facade.search_aluno_escola_facade(vinculo_escola=vinculo_escola)
    observador = facade.search_observador_escola(vinculo_escola=vinculo_escola)

    for a in aluno:
        a['email'] = ""
        a['vinculo_rede'] = get_nome_rede(a['vinculo_rede'])
        a['vinculo_escola'] = get_nome_escola(a['vinculo_escola'])
        a['vinculo_turma'] = get_nome_turma(a['vinculo_turma'])
        a['tipo'] = TIPO_USUARIOS_ID[a['tipo']]
        usuario.append(a)
    for o in observador:
        if o['tipo'] != '0':
            o['vinculo_rede'] = get_nome_rede(o['vinculo_rede'])
            o['vinculo_escola'] = get_nome_escola(o['vinculo_escola'])
            o['vinculo_turma'] = get_nome_turma(o['vinculo_turma'])
            o['tipo'] = TIPO_USUARIOS_ID[o['tipo']]
            usuario.append(o)
    return usuario

def lista_de_usuarios_caso_observador_for_professor(vinculo_turma):
    usuario = []
    aluno = facade.search_aluno_by_turma_facade(vinculo_turma=vinculo_turma)

    for a in aluno:
        a['email'] = ""
        a['vinculo_rede'] = get_nome_rede(a['vinculo_rede'])
        a['vinculo_escola'] = get_nome_escola(a['vinculo_escola'])
        a['vinculo_turma'] = get_nome_turma(a['vinculo_turma'])
        a['tipo'] = TIPO_USUARIOS_ID[a['tipo']]
        usuario.append(a)

    return usuario

def get_nome_rede(vinculo_rede):
    rede_nome = facade.search_estrutura_id_facade(vinculo_rede)['nome']

    return rede_nome

def get_nome_escola(vinculo_escola):
    escola_nome = facade.search_estrutura_id_facade(vinculo_escola)['nome']

    return escola_nome

def get_nome_turma(vinculo_turma):
    turma_nome = facade.search_estrutura_id_facade(vinculo_turma)['nome']

    return turma_nome

def controller_filtro_opcoes(observador):
    if observador['tipo'] is '0':
        rede = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'])
        escola = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'])
        turma = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'])

        return rede, escola, turma

    elif observador['tipo'] is '1':
        rede = facade.search_estrutura_id_facade(id=int(observador['vinculo_rede']))
        escola = []
        turma = []
        for e in facade.search_estrutura_escola_by_rede_facade(vinculo_rede=str(rede['id'])):
            escola.append(e)
            for t in facade.search_estrutura_turma_by_escola_facade(vinculo_escola=str(e['id'])):
                    turma.append(t)

        return rede, escola, turma

    elif observador['tipo'] is '2':
        escola = facade.search_estrutura_id_facade(id=int(observador['vinculo_escola']))
        rede = facade.search_estrutura_id_facade(id=int(escola['vinculo_rede']))
        turma = []
        for t in facade.search_estrutura_turma_by_escola_facade(vinculo_escola=str(escola['id'])):
            turma.append(t)

        return rede, escola, turma

    elif observador['tipo'] is '3':
        escola = facade.search_estrutura_id_facade(id=int(observador['vinculo_escola']))
        rede = facade.search_estrutura_id_facade(id=int(escola['vinculo_rede']))
        turma = []



        return rede, escola, turma

#      BOTAO CADASTRO , OPÇAO ALUNO

@route('/aluno/cadastro_aluno')
@permissao('professor')
@view('aluno/aluno_cadastro')
def aluno():

    observador = usuario_logado()
    if observador['tipo'] == '0':
        escolas = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'])
        return dict(escolas=escolas, tipo_observador=observador['tipo'])
    elif observador['tipo'] == '1':
        escolas = facade.search_estrutura_escola_by_rede_facade(observador['vinculo_rede'])
        return dict(escolas=escolas, tipo_observador=observador['tipo'])
    elif observador['tipo'] == '2':
        escolas = facade.search_estrutura_id_facade(int(observador['vinculo_escola']))
        return dict(escolas=escolas, tipo_observador=observador['tipo'])

    elif observador['tipo'] == '3':
        escolas = facade.search_estrutura_id_facade(int(observador['vinculo_escola']))
        return dict(escolas=escolas, tipo_observador=observador['tipo'])


@route('/aluno_cadastro', method='POST')
def create_aluno():
    """
    Direcionamento a pagina para criar aluno buscando , na tpl os parâmetros usuário , senha e matricula
    Chama a funçao create_aluno_facade
    :return:
    """
    escola = request.forms['escola']
    vinculo_rede=facade.search_estrutura_id_facade(int(escola))
    facade.create_aluno_facade(nome=request.forms['aluno_nome'], matricula=request.forms['matricula'],escola=escola, senha=request.forms['senha'],vinculo_rede=vinculo_rede['vinculo_rede'])
    redirect('/')

#     BOTAO CADASTRO OPÇAO OBSERVADORES


def gerar_matricula(self):

    matricula = []
    for i in range(0, 5):
        matricula.append(randrange(1, 9))
    matricula = ''.join(str(x) for x in matricula)
    return matricula

@route('/observador/cadastro')
@permissao('professor')
def view_observador_cadastro():
    tipo_observador = int(request.params['tipo_observador'])
    escola = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'])
    rede = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'])
    turma = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'])

    if tipo_observador == 0:
        return template('observador/create_observador', tipo=tipo_observador)
    elif tipo_observador == 1:
        return template('observador/create_observador', tipo=tipo_observador, rede=rede)
    elif tipo_observador == 2:
        return template('observador/create_observador', tipo=tipo_observador, escola=escola)
    elif tipo_observador == 3:
        return template('observador/create_observador', tipo=tipo_observador, escola=escola, turma=turma)
    elif tipo_observador == 4:
        redirect('/observador')
    else:
        redirect('/observador')

@route('/create_observador', method="POST")
@permissao('professor')
def controller_observador_cadastro():
    tipo = request.params['tipo']
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = request.params['cpf']
    email = request.params['email']
    escola = request.params['escola']
    rede = request.params['rede']
    turma = request.params['turma']

    if tipo != '1':
        vinculo_rede = facade.search_estrutura_id_facade(int(escola))
        facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf,email=email, tipo=tipo,
                                  escola=escola, rede=vinculo_rede['vinculo_rede'], vinculo_turma=turma)
    else:
        facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo,
                                        escola=escola, rede=rede, vinculo_turma=turma)

@get('/observador/editar')
@permissao('professor')
def view_observador_update():
    nome = request.params['nome']
    observador = facade.search_observador_facade(nome)
    return template('observador/update_observador', id=observador['id'], nome=observador['nome'],
                    telefone=observador['telefone'], cpf=observador['cpf'], email=observador['email'])

@route('/observador/update_observador', method='POST')
@permissao('professor')
def controller_observador_update():
    facade.update_observador_facade(id=request.params['id'], nome=request.params['nome'],
                                    telefone=request.params['telefone'], cpf=request.params['cpf'],
                                    email=request.params['email'])
    redirect('/observador/read_observador')

@route('/observador/email_existe', method='POST')
@permissao('professor')
def controller_checar_se_email_existe():
    email = request.params['teste_email']
    verificacao = facade.search_observador_email_facade(email=email)
    if verificacao is not None:
        return verificacao['email']
    else:
        return None

#                     BOTAO DE MEDALHA


@route('/medalha_cadastro')
@view('observador/medalha_cadastro.tpl')
def cadastrar_medalha():
    """
    pagina de cadastro de medalha
    :return:
    """
    return


@route('/create_medalha', method='POST')
def controller_medalha_cadastro():

    nome = request.params['nome']
    tipo = request.params['tipos']
    facade.create_medalha_facade(nome=nome, tipo=tipo)
    redirect('/gestao_aprendizagem')

@route('/ler_medalha')
@permissao('professor')
@view('observador/read_medalhas.tpl')
def read_de_medalha():
    medalhas = []

    for medalha in facade.read_medalha_facade():
        medalhas.append(medalha)

    return dict(medalhas=medalhas)



#                 BOTAO DE REDES


@route('/rede')
@permissao('gestor')
@view("rede/rede")
def view_index_rede():
    """
    pagina inicial de rede , que mostra , tambem , as redes disponiveis no banco
    metodos usados: controller_read_rede :interno:
    :return: Dicionario de redes
    """
    redes = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'])
    return dict(redes=redes)


@route('/rede/create_rede')
@permissao('gestor')
@view('rede/create_rede')
def view_rede_cadastro():
    """
    Vizualizaçao da pagina de criar redes
    :return: vazio
    """
    return


@route('/rede/criar_rede', method='POST')
@permissao('gestor')
def controller_create_rede():
    """
    Cria rede com os parametros de nome da rede e o telefone da mesma
    metodos usados:create rede facade
    :return:
    """
    nome = request.params['nome_rede']
    telefone = request.params['telefone']
    facade.create_estrutura_facade(nome=nome, telefone=telefone,tipo_estrutura="1")
    redirect('/rede')

@route('/rede/update_rede')
@permissao('gestor')
@view('modificar_rede')
def view_modificar_rede():
    pass

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

@route('/escola/escola_cadastro')
@permissao('gestor')
@view('escola/create_escola')
def cadastro_escola():

    observador1 = usuario_logado()
    if observador1['tipo'] == '1':
        rede = facade.search_estrutura_id_facade(int(observador1['vinculo_rede']))
        return dict(observador_tipo=observador1['tipo'], rede=rede)
    elif observador1['tipo'] == '0':
        rede = facade.read_estrutura_facade(tipo_estrutura='1')
        return dict(observador_tipo=observador1['tipo'], rede=rede)

@route('/escola/criar_escola', method='POST')
@permissao('gestor')
def view_escola_cadastro():
    observador = usuario_logado()
    if observador['tipo'] == '1':
        rede = int(observador['vinculo_rede'])
        nome = request.params['nome']
        telefone = request.params['telefone']
        cep = request.params['cep']
        estado = request.params['estado']
        uf = request.params['uf']
        numero = request.params['numero']
        if filtro_cadastro(nome, cep, numero, telefone, estado, uf):
            facade.create_escola_facade(nome=nome, telefone=telefone, cep=cep, estado=estado, uf=uf, numero=numero,
                                        vinculo_rede=rede)
            redirect("/escola")
    elif observador['tipo'] == '0':
        # rede = facade.search_rede_id_facade(int(observador['vinculo_rede']))
        nome = request.params['nome']
        telefone = request.params['telefone']
        cep = request.params['cep']
        estado = request.params['estado']
        uf = request.params['uf']
        numero = request.params['numero']
        rede_pertencente = request.params['rede']

        if filtro_cadastro(nome, cep, numero, telefone, estado, uf):
            facade.create_estrutura_facade(nome=nome, tipo_estrutura='2', telefone=telefone, cep=cep, estado=estado,
                                           uf=uf, numero=numero,
                                           vinculo_rede=rede_pertencente)
            # rede = facade.read_rede_facade()
            redirect("/escola")
        else:
            print("Erro para salvar escola")

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

def controller_escola_read():
    """
    Cria uma lista , coloca as escolas do banco na lista para mostrar na tela
    metodos usados: read_escola_facade
    :return: a lista de escolas q serao mostradas
    """
    escolas = []
    escola = facade.read_estrutura_facade(tipo_estrutura='2')
    if escola is None:
        return None
    else:
        for e in escola:
            if int(e['vinculo_rede']) > 0:
                rede = facade.search_estrutura_id_facade(int(e['vinculo_rede']))
                e['vinculo_rede'] = rede['nome']
            escolas.append(e)
        return escolas

@route('/escola/update_escola', method='POST')
@permissao('gestor')
def controller_escola_update():
    """
    modifica os dados da escola
    :return:
    """
    facade.update_escola_facade(id=request.params['id'], nome=request.params['nome'], numero=request.params['numero'],
                                telefone=request.params['telefone'], estado=request.params['estado'],
                                cidade=request.params['cidade'], vinculo_rede=request.params['rede_pertencente'])
    redirect('/')

@get('/escola/editar')
@permissao('gestor')
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

#                   BOTAO DE TURMA

@route('/turma')
@permissao('professor')
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
@permissao('diretor')
@view('turma/turma_cadastro')
def view_cadastrar_turma():
    """
    Pagina de cadastro de turma , mostra as escolas ja cadastradas no banco de dados
    metodos usados: read_escola_facade
    :return:o dicionario com as escolas
    """

    observador = usuario_logado()
    if observador['tipo'] == '2':
        escola = facade.search_estrutura_id_facade(int(observador['vinculo_escola']))
        return dict(escolas=escola, observador_tipo = observador['tipo'])
    elif observador['tipo'] == '1':
        escola = []
        escolas = facade.read_estrutura_facade(tipo_estrutura='2')
        for e in escolas:
            if e['vinculo_rede'] is observador['vinculo_rede']:
                escola.append(e)

        return dict(escolas=escola, observador_tipo=observador['tipo'])
    elif observador['tipo'] == '0':
        escola = facade.read_estrutura_facade(tipo_estrutura='2')
        return dict(escolas=escola, observador_tipo=observador['tipo'])

@route('/turma/turma_update', method='POST')
@permissao('diretor')
def view_update_turma():
    """
    Pagina de cadastro de turma , mostra as escolas ja cadastradas no banco de dados
    metodos usados: read_escola_facade
    :return:o dicionario com as escolas
    """
    id = request.forms['id_turma']

    turma = facade.search_estrutura_id_facade(int(id))
    aluno = facade.search_aluno_escola_facade(turma['escola'])
    alunos = []
    for a in aluno:
        if a['vinculo_turma'] == '0':
            alunos.append(a)
    professor = facade.search_observador_escola_listagem_facade(tipo_usuario=TIPO_USUARIOS['professor'],vinculo_escola=turma['escola'])
    professores = []
    for p in professor:
        if p['vinculo_turma'] is '0':
            professores.append(p)

    return template('turma/turma_update', turma=turma, aluno = alunos, professor = professores)

@route('/turma/turma_update_controller', method='POST')
@permissao('diretor')
def controller_update_turma():

    teste = request.forms

    turma = request.forms['turma']
    alunos = [aluno.split('_')[1] for aluno in teste if 'aluno' in aluno]
    professores = [professor.split('_')[1] for professor in teste if 'professor' in professor]

    if alunos is not '' or alunos is not []:
        for a in alunos:
            facade.aluno_in_turma_facade(id_aluno=a, vinculo_turma=turma)

    if professores is not '' or professores is not []:
        for p in professores:
            facade.observador_in_turma_facade(id_observador=p,vinculo_turma=turma)

    redirect('/turma')

@route('/turma/cadastro_turma', method='POST')
@permissao('diretor')
def controller_create_turma():
    """
    """
    turma = request.forms['turma_nome']
    serie = request.forms['serie']
    escola = request.forms['escola']
    facade.create_estrutura_facade(nome=turma, tipo_estrutura='3',quem_criou=request.get_cookie("login", secret='2524'), serie=serie, vinculo_escola=escola)
    redirect('/turma')

@permissao('professor')
def controller_read_turma():
    """
    Direciona para a pagina que mostra a turma e nomeia as series
    metodos usados: read_turma_facade
    :return: a entrada de dicionario que contem o id e o turma_nome
    """
    turmas = facade.read_estrutura_facade(tipo_estrutura='3')
    if turmas == None:
        return None
    else:

        turma = []
        for t in turmas:
            escola = facade.search_estrutura_id_facade(int(t['escola']))
            t['escola'] = escola['nome']
            t['serie'] = SERIE[t['serie']]
            turma.append(t)

        return turma


"""Turma Delete"""


@get('/deletar_turma')
@permissao('diretor')
def deletar_turma():
    """
    nao implementado
    :return:
    """
    facade.delete_turma_facade(request.params['id'])
    redirect('/turma')




    return usuario
