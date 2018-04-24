from bottle import *
from facade.rede_facade import RedeFacade
from facade.escola_facade import EscolaFacade
from facade.aluno_facade import AlunoFacade
from facade.loja_facade import LojaFacade
from facade.observador_facade import ObservadorFacade

rede_facade = RedeFacade()
escola_facade = EscolaFacade()
aluno_facade = AlunoFacade()
loja_facade = LojaFacade()
observador_facade = ObservadorFacade()
escola_facade = EscolaFacade()


@route('/usuario')
@view('usuario/index')
def view_usuario_index():
    """
    Cria o cookie para o obsevador e mostra todos os usuarios , escolas e redes cadastradas
    :return:
    """
    if request.get_cookie("login", secret='2525'):
        observador = observador_facade.search_observador_facade(request.get_cookie("login", secret='2525'))
        usuarios = controller_usuario_index(observador)
        escola, rede = controller_filtro_lista_usuarios()

        return dict(observador_tipo=observador['tipo'], usuarios=usuarios, escolas=escola, redes=rede)
    else:

        redirect('/')


@route('/usuario/redirect_cadastro')
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

    redirect('/usuario')


@route('/usuario/filtro_usuario', method="POST")
def controller_filtro_usuario():
    filtro_escola = request.params['escola']
    filtro_rede = request.params['rede']
    filtro_usuario = request.params['tipo_usuario']
    observador_logado = observador_facade.search_observador_facade(request.get_cookie("login", secret='2525'))

    if filtro_rede is '0':
        if filtro_escola is '0':
            if filtro_usuario is not '0':
                if filtro_usuario == '1' or filtro_usuario == '2' or filtro_usuario == '3':
                    usuarios = observador_facade.search_observador_tipo_facade(filtro_usuario)

                elif filtro_usuario == '6':
                   usuarios = aluno_facade.read_aluno_facade()

            else:
                usuarios = controller_usuario_index(observador_logado)
        else:
            if filtro_usuario is '0':
                usuarios = []
                observador = observador_facade.read_observador_facade()
                aluno = aluno_facade.read_aluno_facade()
                for o in observador:
                    if o['vinculo_escola'] is filtro_escola:
                        usuarios.append(o)

                for a in aluno:
                    if a['vinculo_escola'] is filtro_escola:
                        usuarios.append(a)
            else:
                if filtro_usuario == '1' or filtro_usuario == '2' or filtro_usuario == '3':
                    usuarios = []
                    observador = observador_facade.read_observador_facade()
                    for o in observador:
                        if o['vinculo_escola'] is filtro_escola:
                            if o['tipo'] is filtro_usuario:
                                usuarios.append(o)
                elif filtro_usuario == '6':
                   usuarios = []
                   aluno = aluno_facade.read_aluno_facade()
                   for a in aluno:
                       if a['vinculo_escola'] is filtro_escola:
                           if a['tipo'] is filtro_usuario:
                                usuarios.append(a)
    else:
        if filtro_usuario is '0':
            usuarios = []
            observador = observador_facade.read_observador_facade()
            aluno = aluno_facade.read_aluno_facade()
            escola = escola_facade.read_escola_facade()
            for e in escola:
                if e['vinculo_rede'] is filtro_rede:
                    for o in observador:
                        if int(o['vinculo_escola']) is e['id']:
                            usuarios.append(o)
                    for a in aluno:
                        if int(a['vinculo_escola']) is e['id']:
                            usuarios.append(a)



    return template('bottle/usuario/bottle_usuario_read_usuarios.tpl',
                    usuarios=usuarios, observador_tipo=observador_logado)


def controller_filtro_lista_usuarios():
    escola = escola_facade.read_escola_facade()
    escolas = []
    for e in escola:
        escolas.append(e)

    rede = rede_facade.read_rede_facade()
    redes = []
    for r in rede:
        redes.append(r)

    return escolas, redes


def controller_usuario_index(observador_logado):
    if observador_logado['tipo'] == '0':
        return usuario_logado_administrador()

    elif observador_logado['tipo'] == '3':
        return usuario_logado_professor(observador_logado)

    elif observador_logado['tipo'] == '2':
        return usuario_logado_diretor(observador_logado)

    elif observador_logado['tipo'] == '1':
        return usuario_logado_gestor(observador_logado)


def tipo_usuario(id_tipo):
    if id_tipo is '1':
        return "GESTOR"
    elif id_tipo is '2':
        return "DIRETOR"
    elif id_tipo is '3':
        return "PROFESSOR"
    elif id_tipo is '6':
        return "ALUNO"


def usuario_logado_administrador():
    aluno = aluno_facade.read_aluno_facade()
    observador = observador_facade.read_observador_facade()
    usuario = []
    print("USUARIO CONTROLER aluno l108",aluno)
    print("observador(usuario controler linha 109)",observador)
    for i in aluno:
        print("escola encontrada abaixo(L111 UC)", i['vinculo_escola'])
        escola = escola_facade.search_escola_id_facade(int(i['vinculo_escola']))
        i['tipo'] = tipo_usuario(i['tipo'])
        i['vinculo_escola'] = escola['nome']
        if escola['vinculo_rede'] is not '0':
            rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
            i['vinculo_rede'] = rede['nome']
        else:
            i['vinculo_rede'] = ""

        print("ue (usuario_controler linha119")
        usuario.append(i)

    for x in observador:
        if x['tipo'] is not '0':
            print("entao , vinculo escola", x['vinculo_escola'])
            if x['vinculo_escola'] is not '0':
                escola = escola_facade.search_escola_id_facade(int(x['vinculo_escola']))
                x['tipo'] = tipo_usuario(x['tipo'])
                x['vinculo_escola'] = escola['nome']
                print("entao as vezes vira...", x['vinculo_escola'])
                print("pois , por algum motivo , nome escola é", escola['nome'])
                if escola['vinculo_rede'] is not '0' and None:
                    print("escola , vinculo rede ...", escola['vinculo_rede'])
                    rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                    x['vinculo_rede'] = rede['nome']
                else:
                    print("to aqui :/")
                    x['vinculo_rede'] = ""

            elif x['vinculo_rede'] is not '0':
                rede = rede_facade.search_rede_id_facade(int(x['vinculo_rede']))
                x['vinculo_escola'] = ""
                x['vinculo_rede'] = rede['nome']
                x['tipo'] = tipo_usuario(x['tipo'])

            usuario.append(x)
    return usuario

    return usuario, escola, rede

def usuario_logado_gestor(observador_logado):
    aluno = aluno_facade.read_aluno_facade()
    observador = observador_facade.read_observador_facade()
    usuario = []
    for i in aluno:
        escola = escola_facade.search_escola_id_facade(int(i['vinculo_escola']))
        if escola['vinculo_rede'] == observador_logado['vinculo_rede']:
            i['tipo'] = tipo_usuario(i['tipo'])
            i['vinculo_escola'] = escola['nome']
            if escola['vinculo_rede'] is not '0':
                rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                i['vinculo_rede'] = rede['nome']
            else:
                i['vinculo_rede'] = ""
            usuario.append(i)

    for x in observador:
        if x['tipo'] is not '0' and x['tipo'] is not '1':
            if x['vinculo_escola'] is not '0':
                escola = escola_facade.search_escola_id_facade(int(x['vinculo_escola']))
                if escola['vinculo_rede'] == observador_logado['vinculo_rede']:
                    x['tipo'] = tipo_usuario(x['tipo'])
                    x['vinculo_escola'] = escola['nome']
                    if escola['vinculo_rede'] is not '0':
                        rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                        x['vinculo_rede'] = rede['nome']
                    else:
                        x['vinculo_rede'] = ""
                    usuario.append(x)

            elif x['vinculo_rede'] is not '0':
                rede = rede_facade.search_rede_id_facade(int(x['vinculo_rede']))
                x['vinculo_escola'] = ""
                x['vinculo_rede'] = rede['nome']
                x['tipo'] = tipo_usuario(x['tipo'])
                usuario.append(x)

    return usuario


def usuario_logado_diretor(observador_logado):
    aluno = aluno_facade.read_aluno_facade()
    observador = observador_facade.read_observador_facade()
    escola1 =escola_facade.read_escola_facade()
    usuario = []
    for i in aluno:
        if i['vinculo_escola'] is observador_logado['vinculo_escola']:
            escola = escola_facade.search_escola_id_facade(int(i['vinculo_escola']))
            i['tipo'] = tipo_usuario(i['tipo'])
            i['vinculo_escola'] = escola['nome']
            if escola['vinculo_rede'] is not '0':
                rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                i['vinculo_rede'] = rede['nome']
            else:
                i['vinculo_rede'] = ""
            usuario.append(i)

    for x in observador:
        print("vinculorede?", x['vinculo_rede'])
        if x['tipo'] is not '0' and x['tipo'] is not '1':
            if x['vinculo_escola'] is not '0':
                if x['vinculo_escola'] == observador_logado['vinculo_escola']:
                    print("entrei aqui e o erro esta em escola no prox if")
                    escola = escola_facade.search_escola_id_facade(int(x['vinculo_escola']))
                    print("o maior erro? linha212 usuario controller")
                    if int(x['vinculo_escola']) is escola['id']:
                        print("aqui?")
                        x['tipo'] = tipo_usuario(x['tipo'])
                        x['vinculo_escola'] = escola['nome']
                    elif escola['vinculo_rede'] is not '0':
                        print("ou aqui?")
                        rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                        x['vinculo_rede'] = rede['nome']
                else:
                    x['vinculo_rede'] = ""
                usuario.append(x)

            elif x['vinculo_rede'] is not '0' and None:
                print("print", x['vinculo_rede'])
                rede = rede_facade.search_rede_id_facade(int(x['vinculo_rede']))
                x['vinculo_escola'] = ""
                x['vinculo_rede'] = rede['nome']
                x['tipo'] = tipo_usuario(x['tipo'])

                usuario.append(x)

    return usuario


def usuario_logado_professor(observador_logado):
    aluno = aluno_facade.read_aluno_facade()
    observador = observador_facade.read_observador_facade()
    usuario = []
    for i in aluno:
        if i['vinculo_escola'] is observador_logado['vinculo_escola']:
            escola = escola_facade.search_escola_id_facade(int(i['vinculo_escola']))
            i['tipo'] = tipo_usuario(i['tipo'])
            i['vinculo_escola'] = escola['nome']
            if escola['vinculo_rede'] is not '0':
                rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                i['vinculo_rede'] = rede['nome']
            else:
                i['vinculo_rede'] = ""
            usuario.append(i)

    for x in observador:
        if x['tipo'] is not '0' and x['tipo'] is not '1' and x['tipo'] is not '2':
            if x['vinculo_escola'] is not '0':
                # print("vinculo escola",x['vinculo_escola'])
                if x['vinculo_escola'] == observador_logado['vinculo_escola']:
                    # print("estou aqui")
                    # print("eis a informaçao q quer:", observador_logado['vinculo_escola'])
                    # print("erro>>", escola_facade.search_escola_id_facade(int(x['vinculo_escola'])))
                    escola = escola_facade.search_escola_id_facade(int(x['vinculo_escola']))

                    if int(x['vinculo_escola']) is escola['id']:
                        x['tipo'] = tipo_usuario(x['tipo'])
                        x['vinculo_escola'] = escola['nome']
                    if escola['vinculo_rede'] is not '0':
                        rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                        x['vinculo_rede'] = rede['nome']
                    else:
                        x['vinculo_rede'] = ""
                usuario.append(x)

            elif x['vinculo_rede'] is not '0':
                rede = rede_facade.search_rede_id_facade(int(x['vinculo_rede']))
                x['vinculo_escola'] = ""
                x['vinculo_rede'] = rede['nome']
                x['tipo'] = tipo_usuario(x['tipo'])

                usuario.append(x)

    return usuario

