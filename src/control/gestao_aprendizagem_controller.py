from bottle import route, view, request, redirect, get, template
from facade.facade_main import Facade
from passlib.hash import sha512_crypt
import random

from control.classes.permissao import usuario_logado, permissao
from control.dicionarios import TIPO_USUARIOS_ID, TIPO_USUARIOS, TIPO_ESTRUTURA, SERIE

facade = Facade()

niveis_pontuacao = {
        'dificil': 2,
        'medio': 1,
        'facil': 0
    }

@permissao('responsavel_varejo')
def view_gestao_aprendizagem():
    observador = usuario_logado()
    return dict(usuario=observador['nome'], tipo=observador['tipo'])


@permissao('professor')
def view_usuario_index():
    """
    mostra todos os usuarios , escolas e redes cadastradas
    :return:
    """
    observador = usuario_logado()
    usuario = controller_index_usuario(observador)
    escola, rede = get_escolas_e_rede_permissao()
    turma = get_turma_de_acordo_com_tipo_usuario_logado()
    return dict(tipo=observador['tipo'], usuarios=usuario, rede=rede, escolas=escola, turmas=turma)


def cadastro_usuario():
    usuario = request.params
    print(usuario['tipo'])
    if TIPO_USUARIOS[usuario['tipo']] == TIPO_USUARIOS['aluno']:
        aluno_create(usuario=usuario)
    elif TIPO_USUARIOS[usuario['tipo']] == TIPO_USUARIOS['professor']:
        print("Entrei aqui!")
        professor_create(usuario)
        send_email_confirmation(nome=usuario['nome'], email=usuario['email'])
    elif TIPO_USUARIOS[usuario['tipo']] == TIPO_USUARIOS['diretor']:
        diretor_create(usuario)

        send_email_confirmation(nome=usuario['nome'], email=usuario['email'])
    else:
        gestor_create(usuario)
        send_email_confirmation(nome=usuario['nome'], email=usuario['email'])

def aluno_create(usuario):
    vinculo_rede = facade.search_estrutura_id_facade(id=usuario['vinculo_escola'])
    facade.create_aluno_facade(tipo_aluno=TIPO_USUARIOS['aluno'], nome=usuario['nome'],
                               primeiro_nome=usuario['nome'].split()[0].upper(),nascimento=usuario['nascimento'],
                               sexo=usuario['sexo'],vinculo_rede=vinculo_rede['vinculo_rede'],
                               vinculo_escola=usuario['vinculo_escola'], vinculo_turma=usuario['vinculo_turma'],
                               nome_login=create_student_login(usuario['nome']), senha=password_student_generate())

def password_student_generate():
    senha=random.sample(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'], 4)
    senha.sort()
    return ''.join(senha)

def create_student_login(nome_completo):
    nome_login = nome_completo.split()[0].upper()
    existe_usuario = facade.search_aluno_primeiro_nome_facade(nome_login)
    if existe_usuario != []:
        return nome_login + str(len(existe_usuario))
    else:
        return nome_login


def professor_create(usuario):
    vinculo_rede = facade.search_estrutura_id_facade(id=usuario['vinculo_escola'])
    facade.create_observador_facade(tipo=TIPO_USUARIOS['professor'], nome=usuario['nome'], senha=sha512_crypt.hash(password_generate()),
                                    data_nascimento=usuario['nascimento'], email=usuario['email'],
                                    vinculo_rede=vinculo_rede['vinculo_rede'], vinculo_escola=usuario['vinculo_escola'],
                                    vinculo_turma=usuario['vinculo_turma']
                                    )

def diretor_create(usuario):
    vinculo_rede = facade.search_estrutura_id_facade(id=usuario['vinculo_escola'])
    facade.create_observador_facade(tipo=TIPO_USUARIOS['diretor'], nome=usuario['nome'], senha=sha512_crypt.hash(password_generate()),
                                    data_nascimento=usuario['nascimento'], email=usuario['email'],
                                    vinculo_rede=vinculo_rede['vinculo_rede'], vinculo_escola=usuario['vinculo_escola'])


def gestor_create(usuario):
    facade.create_observador_facade(tipo=TIPO_USUARIOS['gestor'], nome=usuario['nome'], senha=sha512_crypt.hash(password_generate()),
                                    data_nascimento=usuario['nascimento'], email=usuario['email'],
                                    vinculo_rede=usuario['vinculo_rede'])


def password_generate():
    senha=random.sample(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                         'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'z', '!','@','#','$','%','&','*'], 8)
    senha.sort()

    print(senha)
    return ''.join(senha)

def send_email_confirmation(nome, email):
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    import smtplib

    url = 'http://127.0.0.1:8080/new_senha?email='+email
    msg = MIMEMultipart()
    msg['From'] = "ti@conecturma.com.br"
    msg['To'] = email
    msg['Subject'] = "Bem Vindo, a conecturma!"
    senha = "@onde2929"
    body = "<p>" \
                "<h3>"+nome+"</h3>"\
                "<h4>Agora você faz parte da Conecturma!</h4>" \
                "Segue o link para ativação da conta da Conecturma: </br>"\
                "<a href='"+url+"'>"+url+"</a>"
    msg.attach(MIMEText(body, 'html'))
    print(msg)

    server = smtplib.SMTP('mail.conecturma.com.br', 587)
    server.starttls()
    server.login(msg['From'], senha)
    server.sendmail(msg['From'], msg['To'], msg.as_string())
    server.quit()

def new_password():
    email = request.params['email']

    return template('alterar_senha.tpl', id=id, email=email)

def novasenha():
    email = request.params['email']
    senha = request.params['senha_nova']
    usuario = facade.search_observador_email_facade(email=email)
    facade.redefinir_senha_facade(id=usuario['id'], senha=sha512_crypt.hash(senha))
    redirect('/')


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
        a['email'] = ''
        a['vinculo_rede'] = get_nome_rede(a['vinculo_rede'])
        a['vinculo_escola'] = get_nome_escola(a['vinculo_escola'])
        a['vinculo_turma'] = get_nome_turma(a['vinculo_turma'])
        a['tipo'] = TIPO_USUARIOS_ID[a['tipo']]
        usuario.append(a)

    for o in observador:
        if o['tipo'] != '0':
            o['vinculo_rede'] = get_nome_rede(o['vinculo_rede'])
            if o['vinculo_escola'] != '0':
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
        if int(o['tipo']) > int(TIPO_USUARIOS['gestor']):
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
        if a['vinculo_rede'] != '0':
            a['vinculo_rede'] = get_nome_rede(a['vinculo_rede'])
        a['vinculo_escola'] = get_nome_escola(a['vinculo_escola'])
        if a['vinculo_turma'] != '0':
            a['vinculo_turma'] = get_nome_turma(a['vinculo_turma'])
        a['tipo'] = TIPO_USUARIOS_ID[a['tipo']]
        usuario.append(a)
    for o in observador:
        if int(o['tipo']) > int(TIPO_USUARIOS['diretor']):
            if o['vinculo_rede'] != '0':
                o['vinculo_rede'] = get_nome_rede(o['vinculo_rede'])
            o['vinculo_escola'] = get_nome_escola(o['vinculo_escola'])
            if o['vinculo_turma'] != '0':
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
    if vinculo_rede != '0':
        return facade.search_estrutura_id_facade(vinculo_rede)['nome']

    return ''


@permissao('professor')
def get_nome_escola(vinculo_escola):
    if vinculo_escola != '0':
        return facade.search_estrutura_id_facade(vinculo_escola)['nome']
    return ''


@permissao('professor')
def get_nome_turma(vinculo_turma):
    if vinculo_turma != '0':
        return facade.search_estrutura_id_facade(vinculo_turma)['nome']
    return ''



def view_observador_update():
    nome = request.params['nome']
    observador = facade.search_observador_facade(nome)
    return template('observador/update_observador', id=observador['id'], nome=observador['nome'],
                    telefone=observador['telefone'], cpf=observador['cpf'], email=observador['email'])


def controller_observador_update():
    facade.update_observador_facade(id=request.params['id'], nome=request.params['nome'],
                                    telefone=request.params['telefone'], cpf=request.params['cpf'],
                                    email=request.params['email'])
    redirect('/observador/read_observador')


def controller_checar_se_email_existe():
    email = request.params['teste_email']
    verificacao = facade.search_observador_email_facade(email=email)

    if verificacao != None:
        return verificacao['email']
    else:
        return None


def controller_medalha_cadastro():
    nome = request.params['nome']
    tipo = request.params['tipos']
    facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['medalha'], nome=nome, tipo_item=tipo)
    redirect('/gestao_aprendizagem')


def read_de_medalha():
    medalhas = []

    for medalha in facade.read_estrutura_facade(TIPO_ESTRUTURA['medalha']):
        medalhas.append(medalha)

    return dict(medalhas=medalhas)


def view_index_rede():
    """
    pagina inicial de rede , que mostra , tambem , as redes disponiveis no banco
    metodos usados: controller_read_rede :interno:
    :return: Dicionario de redes
    """
    redes = []
    redes_sistema = redes_no_sistema()
    if isinstance(redes_sistema, list):
        for i in redes_sistema:
            escolas = []
            for z in facade.search_estrutura_escola_by_rede_facade(vinculo_rede=str(i['id'])):
                escolas.append(z)

            i.update({'escola': escolas})
            redes.append(i)
    else:
        rede_no_sistema_lista = []
        rede_no_sistema_lista.append(redes_sistema)
        for i in rede_no_sistema_lista:
            escola = []
            for z in facade.search_estrutura_escola_by_rede_facade(vinculo_rede=i['id']):
                escola.append(z)

                i.update({'escola': escola})
            redes.append(i)

    return dict(tipo=usuario_logado()['tipo'], rede=redes)


def redes_no_sistema():
    usuario = usuario_logado()
    if usuario['tipo'] == TIPO_USUARIOS['administrador']:
        rede = []
        for i in facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede']):
            observador = facade.search_observador_by_rede_facade(vinculo_rede=str(i['id']))
            if observador != []:
                for z in observador:
                    if z['tipo'] == '1':
                        i['vinculo_gestor_rede'] = z['nome']
                    else:
                        i['vinculo_gestor_rede'] = ''
            else:
                i['vinculo_gestor_rede'] = ''

            escola = facade.search_estrutura_escola_by_rede_facade(vinculo_rede=str(i['id']))
            rede.append(i)

        return rede

    elif usuario['tipo'] == TIPO_USUARIOS['gestor']:
        rede = []
        rede.append(facade.search_estrutura_id_facade(id=usuario['vinculo_rede']))
        rede[0]['vinculo_gestor_rede'] = usuario['nome']

        return rede


def controller_create_rede():
    """
    Cria rede com os parametros de nome da rede e o telefone da mesma
    metodos usados:create rede facade
    :return:
    """
    nome = request.params['nome']
    telefone = request.params['telefone']
    if nome != '' and nome != None and telefone != '' and telefone != None:
        facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'], nome=nome,
                                       cnpj=request.params['cnpj'], telefone=request.params['telefone'],
                                       endereco=request.params['endereco'], numero=request.params['numero'],
                                       bairro=request.params['bairro'], complemento=request.params['complemento'],
                                       cep=request.params['cep'], estado=request.params['estado'],
                                       municipio=request.params['municipio'], data_de_criacao=request.params['data_de_criacao']
                                       )


def controller_editar_rede():
    facade.update_estrutura_facade(estrutura=request.params)


def view_escola_index():
    """
    view inicial de escola, mostrando as escolas cadastradas no sistema
    usa o metodo: controller_escola_read :interno:
    :return:dicionario com os valores da escola a serem mostrados
    """
    escola = []
    escolas_no_sistema, rede_no_sistema = get_escolas_e_rede_permissao()
    if isinstance(escolas_no_sistema, list):
        for i in escolas_no_sistema:
            professor = []
            for z in facade.search_observador_escola(vinculo_escola=i['id']):
                if z['tipo'] != '2':
                    professor.append(z)
            i.update({'professor': professor})
            escola.append(i)
    else:
        escolas_no_sistema_lista = []
        escolas_no_sistema_lista.append(escolas_no_sistema)
        for i in escolas_no_sistema_lista:
            professor = []
            for z in facade.search_observador_escola(vinculo_escola=i['id']):
                if z['tipo'] != '2':
                    professor.append(z)
            i.update({'professor': professor})
            escola.append(i)

    return dict(tipo=usuario_logado()['tipo'], escola=escola, rede=rede_no_sistema)


def get_escolas_e_rede_permissao():
    usuario = usuario_logado()
    if usuario['tipo'] == TIPO_USUARIOS['administrador']:
        rede = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'])
        escola = []
        for i in facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola']):
            if i['vinculo_rede'] != '0':
                i['vinculo_rede_id'] = i['vinculo_rede']
                i['vinculo_rede'] = get_nome_rede(vinculo_rede=i['vinculo_rede'])
            else:
                i['vinculo_rede_id'] = i['vinculo_rede']
                i['vinculo_rede'] = ' '
            if i['vinculo_diretor_escola'] != '0':
                i['vinculo_diretor_escola'] = get_nome_diretor_da_escola(vinculo_escola=str(i['id']))
            escola.append(i)
          

        return escola, rede

    elif usuario['tipo'] == TIPO_USUARIOS['gestor']:
        escola = []
        rede = facade.search_estrutura_id_facade(id=usuario['vinculo_rede'])
        for i in facade.search_estrutura_escola_by_rede_facade(vinculo_rede=usuario['vinculo_rede']):
            i['vinculo_rede_id'] = i['vinculo_rede']
            i['vinculo_rede'] = get_nome_rede(vinculo_rede=i['vinculo_rede'])
            if i['vinculo_diretor_escola'] != '0':
                i['vinculo_diretor_escola'] = get_nome_diretor_da_escola(vinculo_escola=str(i['id']))
            escola.append(i)
        return escola, rede

    else:
        escola = facade.search_estrutura_id_facade(id=usuario['vinculo_escola'])
        if escola['vinculo_rede'] != '0':
            escola['vinculo_rede_id'] = escola['vinculo_rede']
            escola['vinculo_rede'] = get_nome_rede(vinculo_rede=escola['vinculo_rede'])
        escola['vinculo_diretor_escola'] = usuario['nome']
        rede = facade.search_estrutura_id_facade(id=usuario['vinculo_rede'])
        return escola, rede


def get_nome_diretor_da_escola(vinculo_escola):
    diretor = facade.search_diretor_vinculo_escola_facade(vinculo_escola=vinculo_escola)
    if diretor == None:
        return ' '
    else:
        return diretor['nome']


def controller_escola_cadastro():
    nome = request.params['nome']
    telefone = request.params['telefone']

    if nome != '' and nome != None and telefone != '' and telefone != None:
        facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome=nome,
                                       cnpj=request.params['cnpj'], telefone=request.params['telefone'],

                                       vinculo_rede=request.params['rede'],
                                       endereco=request.params['endereco'], numero=request.params['numero'],
                                       bairro=request.params['bairro'], complemento=request.params['complemento'],
                                       cep=request.params['cep'], estado=request.params['estado'],
                                       municipio=request.params['municipio'], data_de_criacao =request.params['data_de_criacao']
                                       )


def controller_escola_update():
    facade.update_estrutura_facade(estrutura=request.params)


def controller_estrutura_delete():
    facade.delete_estrutura_facade(id=request.params['id'])


def view_turma():
    """
    Pagina inicial de turmas e q mostra as turmas ja cadastradas
    metodos utilizados : controller_read_ turma :interno dessa pagina:
    :return: dicionario com os parametros da turma a serem mostrados
    """
    escola, rede = get_escolas_e_rede_permissao()
    turma = get_turma_de_acordo_com_tipo_usuario_logado()
    return dict(tipo=usuario_logado()['tipo'], escola=escola, turma=turma)


def get_turma_de_acordo_com_tipo_usuario_logado():
    usuario = usuario_logado()
    if usuario['tipo'] == TIPO_USUARIOS['administrador']:
        turma = []
        for i in facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma']):
            i['serie'] = SERIE[i['serie']]
            i['vinculo_escola'] = get_nome_escola(vinculo_escola=i['vinculo_escola'])
            professor = ''
            aluno = []
            for z in facade.search_observador_turma(vinculo_turma=str(i['id'])):
                if z != []:
                    professor=z['nome']
            i.update({'professor': professor})
            for y in facade.search_aluno_by_turma_facade(vinculo_turma=str(i['id'])):
                aluno.append(y)
            i.update({'aluno': aluno})
            turma.append(i)
        print('turma',turma)
        return turma
    elif usuario['tipo'] == TIPO_USUARIOS['gestor']:
        turma = []
        for i in facade.search_estrutura_turma_by_rede_facade(vinculo_rede=usuario['vinculo_rede']):
            i['serie'] = SERIE[i['serie']]
            print('i', i)
            i['vinculo_escola'] = get_nome_escola(vinculo_escola=i['vinculo_escola'])
            professor = ''
            aluno = []
            for z in facade.search_observador_turma(vinculo_turma=str(i['id'])):
                if z != []:
                    professor = z['nome']
            i.update({'professor': professor})
            for y in facade.search_aluno_by_turma_facade(vinculo_turma=str(i['id'])):
                aluno.append(y)
            i.update({'aluno': aluno})
            turma.append(i)
        return turma
    elif usuario['tipo'] == TIPO_USUARIOS['diretor']:
        turma = []
        for i in facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma']):
            if i['vinculo_escola'] == usuario['vinculo_escola']:
                i['serie'] = SERIE[i['serie']]
                i['vinculo_escola'] = get_nome_escola(vinculo_escola=i['vinculo_escola'])
                professor = ''
                aluno = []
                for z in facade.search_observador_turma(vinculo_turma=str(i['id'])):
                    if z != []:
                        professor = z['nome']
                i.update({'professor': professor})
                for y in facade.search_aluno_by_turma_facade(vinculo_turma=str(i['id'])):
                    aluno.append(y)
                i.update({'aluno': aluno})
                turma.append(i)
        return turma
    else:
        turma = []
        if usuario['vinculo_turma'] != '0':
            i = facade.search_estrutura_id_facade(id=usuario['vinculo_turma'])
            i['serie'] = SERIE[i['serie']]
            i['vinculo_escola'] = get_nome_escola(vinculo_escola=i['vinculo_escola'])
            professor = ''
            aluno = []
            for z in facade.search_observador_turma(vinculo_turma=str(i['id'])):
                if z != []:
                    professor = z['nome']
            i.update({'professor': professor})
            for y in facade.search_aluno_by_turma_facade(vinculo_turma=str(i['id'])):
                aluno.append(y)
            i.update({'aluno': aluno})
            turma.append(i)

            return turma
        else:
            return -1


def controller_create_turma():
    """
    """
    nome = request.forms['nome']
    serie = request.forms['serie']
    escola = request.forms['escola']
    vinculo_rede = facade.search_estrutura_id_facade(request.forms['escola'])
    data_de_criacao = request.forms['data_de_criacao']
    facade.create_estrutura_facade(nome=nome, tipo_estrutura=TIPO_ESTRUTURA['turma'], serie=serie,
                                   vinculo_escola=escola, vinculo_rede=vinculo_rede['vinculo_rede'])
    redirect('/turma')

def controller_edit_turma():
    print('controler',request.params)
    facade.update_estrutura_facade(estrutura=request.params)


def view_update_turma():
    """
    Pagina de cadastro de turma , mostra as escolas ja cadastradas no banco de dados
    metodos usados: read_escola_facade
    :return:o dicionario com as escolas
    """
    id = request.forms['id_turma']
    turma = facade.search_estrutura_id_facade(int(id))
    return template('turma/turma_update', turma=turma, aluno=alunos_na_escola_sem_turma(turma['vinculo_escola']),
                    professor=professor_na_escola_sem_turma(
                        turma['vinculo_escola']))


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
            facade.observador_in_turma_facade(id_observador=p, vinculo_turma=turma)

    redirect('/turma')


def descritores():
    return

def levar_oas_matematica():
    aluno = facade.search_aluno_id_facade(id_aluno=request.params['aluno'])
    descritores = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['objeto_de_aprendizagem'])
    oa = []
    porcentagem_aluno = []
    diciplina = request.params['diciplina']

    if diciplina != '0':
        for i in descritores:
            if i['disciplina'] == diciplina and 'VC' not in i['sigla_oa'] and 'CN' not in i['sigla_oa']:
                desempenho = facade.search_oa_facade(id_aluno=str(aluno['id']), objeto_aprendizagem=i['sigla_oa'])
                oa.append(i)
                if desempenho != None:
                    porcentagem_aluno.append(cor_desempenho(desempenho=desempenho))
                else:
                    porcentagem_aluno.append(None)
    else:
        for i in descritores:
            if 'VC' not in i['sigla_oa'] and 'CN' not in i['sigla_oa']:
                desempenho = facade.search_oa_facade(id_aluno=str(aluno['id']), objeto_aprendizagem=i['sigla_oa'])
                oa.append(i)
                if desempenho != None:
                    porcentagem_aluno.append(cor_desempenho(desempenho=desempenho))
                else:
                    porcentagem_aluno.append(None)

    return template('gestao_aprendizagem/relatorios/aluno/relatorio_table.tpl', oa=oa, aluno=aluno,
                    porcentagem=porcentagem_aluno)


def checar_pontuiacao(desempenho):
    niveis_pontuação = {
        'dificil': 2,
        'medio': 1,
        'facil': 0
    }
    pontuacao = 0
    for i in desempenho['jogo_jogado']:
        dict_dado_jogo = convertendo_str_in_dict(i)
        if dict_dado_jogo['termino'] == True:
            pontuacao += niveis_pontuação[dict_dado_jogo['nivel']]

    return pontuacao


def media_pontuacao(pontuacao, vezes_jogada):
    media = pontuacao / vezes_jogada

    return media


def porcentagem_pontuacao(pontuacao, vezes_jogada):
    maximo_pontos = vezes_jogada * 2
    porcentagem = (pontuacao * 100) // maximo_pontos

    return str(porcentagem)


def cor_desempenho(desempenho):
    pontuacao = checar_pontuiacao(desempenho=desempenho)
    vezes_jogada = len(desempenho['jogo_jogado'])
    porcentagem_aluno = porcentagem_pontuacao(pontuacao, vezes_jogada)

    return int(porcentagem_aluno)

def convert_game_data_for_numeric(desempenho):
    return niveis_pontuacao[desempenho['nivel']]


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
    elif observador_logado['tipo'] == TIPO_USUARIOS['diretor'] or observador_logado['tipo'] == TIPO_USUARIOS[
        'professor']:
        return facade.search_estrutura_id_facade(observador_logado['vinculo_escola'])


def filtro_vinculo_cadastro_turma():
    observador_logado = usuario_logado()
    if observador_logado['tipo'] == TIPO_USUARIOS['administrador']:
        return facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'])
    elif observador_logado['tipo'] == TIPO_USUARIOS['gestor']:
        return facade.search_estrutura_turma_by_rede_facade(observador_logado['vinculo_rede'])
    elif observador_logado['tipo'] == TIPO_USUARIOS['diretor']:
        return facade.search_estrutura_turma_by_escola_facade(observador_logado['vinculo_escola'])


def alunos_na_escola_sem_turma(vinculo_escola):
    alunos = []
    for a in facade.search_aluno_escola_facade(vinculo_escola):
        if a['vinculo_turma'] == '0':
            alunos.append(a)

    return alunos


def professor_na_escola_sem_turma(vinculo_escola):
    professores = []
    for p in facade.search_observador_escola(vinculo_escola=vinculo_escola):
        if p['vinculo_turma'] == '0' and p['tipo'] == TIPO_USUARIOS['professor']:
            professores.append(p)

    return professores


def trazer_todos_alunos_da_mesma_turma():
    usuario = usuario_logado()
    tipo_usuarios = {
        '0': facade.read_aluno_facade(),
        '1': facade.search_aluno_by_rede_facade(vinculo_rede=usuario['vinculo_rede']),
        '2': facade.search_aluno_escola_facade(vinculo_escola=usuario['vinculo_escola']),
        '3': facade.search_aluno_by_turma_facade(vinculo_turma=usuario['vinculo_turma'])
    }

    alunos = tipo_usuarios[usuario['tipo']]

    for i in alunos:
        i['vinculo_turma'] = get_nome_turma(i['vinculo_turma'])

    return alunos

def convertendo_str_in_dict(str):
    from ast import literal_eval

    python_dict = literal_eval(str)

    return python_dict