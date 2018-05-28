from bottle import route, view, request, redirect, get, template
from facade.facade_main import Facade

from control.classes.permissao import permissao, usuario_logado, permissao
from control.dicionarios import PAGINA_DE_CADASTRO_POR_TIPO,TIPO_USUARIOS_ID,TIPO_USUARIOS,TIPO_ESTRUTURA,SERIE


facade=Facade()

@route('/gestao_aprendizagem')
@permissao('responsavel_varejo')
@view('caminho_observador/gestao_aprendizagem')
def view_gestao_aprendizagem():
    observador = usuario_logado()
    return dict(usuario = observador['nome'], tipo=observador['tipo'])

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
    rede, escola, turma = [], [], []
    return dict(observador_tipo=observador['tipo'], usuarios=usuario, redes=rede, escolas=escola, turmas=turma)

@route('/gestao_aprendizagem/usuario/redirect_cadastro')
@permissao('professor')
def controller_redirect_cadastro():
    tipo_usuario = request.params['tipo_usuario']
    redirect(PAGINA_DE_CADASTRO_POR_TIPO[tipo_usuario])

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

@permissao('administrador')
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

@permissao('gestor')
def lista_de_usuarios_caso_observador_for_gestor(vinculo_rede):
    usuario = []

    aluno = facade.search_aluno_by_rede_facade(vinculo_rede)
    observador = facade.search_observador_by_rede_facade(vinculo_rede=vinculo_rede)

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

@permissao('diretor')
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

@permissao('professor')
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

@permissao('professor')
def get_nome_rede(vinculo_rede):
    rede_nome = facade.search_estrutura_id_facade(vinculo_rede)['nome']

    return rede_nome

@permissao('professor')
def get_nome_escola(vinculo_escola):
    escola_nome = facade.search_estrutura_id_facade(vinculo_escola)['nome']

    return escola_nome

@permissao('professor')
def get_nome_turma(vinculo_turma):
    turma_nome = facade.search_estrutura_id_facade(vinculo_turma)['nome']

    return turma_nome

@route('/aluno/cadastro_aluno')
@permissao('professor')
@view('aluno/aluno_cadastro')
def aluno():
    return dict(escolas=filtro_vinculo_cadastro_escola())

@route('/aluno_cadastro', method='POST')
@permissao('professor')
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


@route('/observador/cadastro')
@permissao('professor')
def view_observador_cadastro():
    tipo_observador = request.params['tipo_observador']

    if tipo_observador == TIPO_USUARIOS['administrador']:
        return template('observador/create_observador', tipo=tipo_observador)
    elif tipo_observador == TIPO_USUARIOS['gestor']:
        return template('observador/create_observador', tipo=tipo_observador, rede=filtro_vinculo_cadastro_rede())
    elif tipo_observador == TIPO_USUARIOS['diretor']:
        return template('observador/create_observador', tipo=tipo_observador, escola=filtro_vinculo_cadastro_escola())
    elif tipo_observador == TIPO_USUARIOS['professor']:
        return template('observador/create_observador',  observador_logado = usuario_logado()['tipo'], tipo=tipo_observador, escola=filtro_vinculo_cadastro_escola(),
                        turma=filtro_vinculo_cadastro_turma())
    elif tipo_observador == TIPO_USUARIOS['responsavel']:
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

@route('/rede')
@permissao('gestor')
@view("rede/rede")
def view_index_rede():
    """
    pagina inicial de rede , que mostra , tambem , as redes disponiveis no banco
    metodos usados: controller_read_rede :interno:
    :return: Dicionario de redes
    """
    return dict(redes=facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede']))


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
    escola = []
    for e in facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola']):
        e['vinculo_rede'] = get_nome_rede(e['vinculo_rede'])
        escola.append(e)
    return dict(escola=escola)

@route('/escola/escola_cadastro')
@permissao('gestor')
@view('escola/create_escola')
def cadastro_escola():
    return dict(rede=filtro_vinculo_cadastro_rede())

@route('/escola/criar_escola', method='POST')
@permissao('gestor')
def controller_escola_cadastro():
    facade.create_estrutura_facade(nome=request.params['nome'], tipo_estrutura=TIPO_ESTRUTURA['escola'],
                                   telefone=request.params['telefone'], cep=request.params['cep'],
                                   estado=request.params['estado'], uf=request.params['uf'],
                                   numero=request.params['numero'], vinculo_rede=request.params['rede']
                                   )
    redirect("/escola")

@route('/turma')
@permissao('professor')
@view('turma/turma')
def view_turma():
    """
    Pagina inicial de turmas e q mostra as turmas ja cadastradas
    metodos utilizados : controller_read_ turma :interno dessa pagina:
    :return: dicionario com os parametros da turma a serem mostrados
    """
    turma = []
    for t in facade.read_estrutura_facade(TIPO_ESTRUTURA['turma']):
        t['serie'] = SERIE[t['serie']]
        t['escola'] = get_nome_escola(t['escola'])
        turma.append(t)
    return dict(turma=turma)

@route('/turma/turma_cadastro')
@permissao('diretor')
@view('turma/turma_cadastro')
def view_cadastrar_turma():
    """
    Pagina de cadastro de turma , mostra as escolas ja cadastradas no banco de dados
    metodos usados: read_escola_facade
    :return:o dicionario com as escolas
    """
    return dict(escolas=filtro_vinculo_cadastro_escola())

def filtro_vinculo_cadastro_rede():
    observador_logado = usuario_logado()
    if observador_logado['tipo'] == TIPO_USUARIOS['administrador']:
        return facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'])
    elif observador_logado['tipo'] == TIPO_USUARIOS['gestor']:
        return facade.search_estrutura_id_facade(observador_logado['vinculo_rede'])

def filtro_vinculo_cadastro_escola():
    observador_logado = usuario_logado()
    if observador_logado['tipo'] == TIPO_USUARIOS['administrador']:
        return facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'])
    elif observador_logado['tipo'] == TIPO_USUARIOS['gestor']:
        return facade.search_estrutura_escola_by_rede_facade(observador_logado['vinculo_rede'])
    elif observador_logado['tipo'] == TIPO_USUARIOS['diretor'] or observador_logado['tipo'] == TIPO_USUARIOS['professor']:
        return facade.search_estrutura_id_facade(observador_logado['vinculo_escola'])

def filtro_vinculo_cadastro_turma():
    observador_logado = usuario_logado()
    if observador_logado['tipo'] == TIPO_USUARIOS['administrador']:
        return facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'])
    elif observador_logado['tipo'] == TIPO_USUARIOS['gestor']:
        return facade.search_estrutura_turma_by_rede_facade(observador_logado['vinculo_rede'])
    elif observador_logado['tipo'] == TIPO_USUARIOS['diretor']:
        return facade.search_estrutura_turma_by_escola_facade(observador_logado['vinculo_escola'])

@route('/turma/cadastro_turma', method='POST')
@permissao('diretor')
def controller_create_turma():
    """
    """
    turma = request.forms['turma_nome']
    serie = request.forms['serie']
    escola = request.forms['escola']
    vinculo_rede = facade.search_estrutura_id_facade(request.forms['escola'])

    facade.create_estrutura_facade(nome=turma, tipo_estrutura='3',quem_criou=usuario_logado()['nome'], serie=serie,
                                   vinculo_escola=escola, vinculo_rede=vinculo_rede['vinculo_rede'])
    redirect('/turma')

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
    return template('turma/turma_update', turma=turma,
                    aluno = alunos_na_escola_sem_turma(turma['escola']), professor=professor_na_escola_sem_turma(turma['escola']))

def alunos_na_escola_sem_turma(vinculo_escola):
    alunos = []
    for a in facade.search_aluno_escola_facade(vinculo_escola):
        if a['vinculo_turma'] == '0':
            alunos.append(a)
    return alunos

def professor_na_escola_sem_turma(vinculo_escola):
    professores = []
    for p in facade.search_observador_escola(vinculo_escola=vinculo_escola):
        if p['vinculo_turma'] == '0' and p['tipo']==TIPO_USUARIOS['professor']:
            professores.append(p)

    return professores

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


@route('/filtro_usuario', method='POST')
def filtro_usuarios():
    rede = request.params['rede']
    observador = usuario_logado()
    redes ,escola, turma = controller_index_usuario(observador=observador)
    print("AGA L625", rede)
    usuarioss=[]
    observador_na_rede = facade.search_observador_by_rede_facade(rede)
    aluno_na_rede= facade.search_aluno_by_rede_facade(rede)
    if observador_na_rede== []:
        pass
    else:
        usuarioss.append(facade.search_observador_by_rede_facade(rede))
    if aluno_na_rede==[]:
        pass
    else:
        usuarioss.append(facade.search_aluno_by_rede_facade(rede))
    print("aluno na rede", facade.search_aluno_by_rede_facade(rede))
    print("numero de itens em escola,turma e usuarios AGA L625", usuarioss, rede, escola, turma, observador['tipo'])
    return dict(usuarios=usuarioss)





# ,escolas=escola,turma=turma
# function getState(val) {
#     $.ajax({
#     type:
#     url: "get_state.php",
#     data:'country_id='+val,
#     success: function(data){
#         $("#state-list").val(data);
#     }
#     });
# }


# (function(data){
#         $('#usuarios_sistema').html(data);
#         }));


# $.getJSON("ajax/test.json", function(data)
# {
#     var
# items = [];
# $.each(data, function(key, val)
# {
#     items.push("<li id='" + key + "'>" + val + "</li>");
# });
#
# $("<ul/>", {
#     "class": "my-new-list",
#     html: items.join("")
# }).appendTo("body");
# });
