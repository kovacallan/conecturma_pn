from bottle import *
from facade.facade_main import Facade

facade = Facade()

@route('/usuario')
@view('usuario/index')
def view_usuario_index():
    """
    Cria o cookie para o obsevador e mostra todos os usuarios , escolas e redes cadastradas
    :return:
    """
    # print("AAAAAAAAAA , user,controler L23")
    if request.get_cookie("login", secret='2525'):
        observador = facade.search_observador_facade(request.get_cookie("login", secret='2525'))
        usuario = controller_index_usuario(observador['tipo'],observador['vinculo_escola'])
        rede, escola, turma = controller_filtro_opcoes(tipo_logado=observador['tipo'])
        return dict(observador_tipo=observador['tipo'], usuarios=usuario, redes=rede, escolas=escola, turmas=turma)
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
    else:
        redirect('/usuario')

def controller_index_usuario(tipo_observador,vinculo_escola):
    aluno = facade.read_aluno_facade()
    observador = facade.search_observador_escola_listagem_facade(login=tipo_observador,vinculo_escola=vinculo_escola)
    usuario = []
    for a in aluno:
        escola=facade.search_escola_id_facade(int(a['vinculo_escola']))
        a['tipo'] = tipo_usuario(a['tipo'])
        a['vinculo_escola'] = escola['nome']
        a['vinculo_rede'] = escola['vinculo_rede']
        usuario.append(a)
    for o in observador:
        if o['tipo'] is not '0':
            if o['tipo'] is not '1':
                escola = facade.search_escola_id_facade(int(o['vinculo_escola']))
                o['tipo'] = tipo_usuario(o['tipo'])
                o['vinculo_escola'] = escola['nome']
                o['vinculo_rede'] = escola['vinculo_rede']
            else:
                rede = facade.search_rede_id_facade(int(o['vinculo_rede']))
                o['tipo'] = tipo_usuario(o['tipo'])
                o['vinculo_escola'] = " "
                o['vinculo_rede'] = rede['nome']

            usuario.append(o)

    return usuario

def controller_filtro_opcoes(tipo_logado):
    observador = facade.search_observador_facade(request.get_cookie("login", secret='2525'))
    if tipo_logado is '0':
        rede = facade.read_rede_facade()
        escola = facade.read_escola_facade()
        turma = facade.read_turma_facade()
        return rede, escola, turma

    elif tipo_logado is '1':
        rede = facade.search_rede_id_facade(id=int(observador['vinculo_rede']))
        escola = []
        turma = []
        for e in facade.read_escola_facade():
            if e['vinculo_rede'] is observador['vinculo_rede']:
                escola.append(e)
                for t in facade.read_turma_facade():
                    if t['escola'] == str(e['id']):
                        turma.append(t)


        return rede, escola, turma
    elif tipo_logado is '2':
        escola = facade.search_escola_id_facade(id=int(observador['vinculo_escola']))
        rede = facade.search_rede_facade(rede=escola['vinculo_rede'])
        turma = []
        for t in facade.read_turma_facade():
            if t['escola'] == str(escola['id']):
                turma.append(t)

        return rede, escola, turma

    """ NÃO ESTÁ PRONTO AINDA !!!!!!! elif tipo_logado is '3':
        escola = facade.search_escola_id_facade(id=int(observador['vinculo_escola']))
        rede = rede = facade.search_rede_facade(rede=escola['vinculo_rede'])
        turma = []



        return rede, escola, turma"""

def tipo_usuario(id_tipo):
    if id_tipo is '1':
        return "GESTOR"
    elif id_tipo is '2':
        return "DIRETOR"
    elif id_tipo is '3':
        return "PROFESSOR"
    elif id_tipo is '6':
        return "ALUNO"


# <<<<<<< HEAD
def usuario_logado_administrador():
    aluno = facade.read_aluno_facade()
    observador = facade.read_observador_facade()
    usuario = []
    for i in aluno:
        escola = facade.search_escola_id_facade(int(i['vinculo_escola']))
        i['tipo'] = tipo_usuario(i['tipo'])
        i['vinculo_escola'] = escola['nome']
        if escola['vinculo_rede'] is not '0' and "":
            # print("usuario linha 161",escola['vinculo_rede'])
            rede = facade.search_rede_id_facade(int(escola['vinculo_rede']))
            i['vinculo_rede'] = rede['nome']
        else:
            i['vinculo_rede'] = ""

        usuario.append(i)

    for x in observador:
        if x['tipo'] is not '0':
            if x['vinculo_escola'] is not '0':
                escola = facade.search_escola_id_facade(int(x['vinculo_escola']))
                x['tipo'] = tipo_usuario(x['tipo'])
                x['vinculo_escola'] = escola['nome']
                if escola['vinculo_rede'] is not '0' and None:
                    rede = facade.search_rede_id_facade(int(escola['vinculo_rede']))
                    x['vinculo_rede'] = rede['nome']
                else:
                    x['vinculo_rede'] = ""
# =======
#
# >>>>>>> ace753242fd33f3bb17ee18c47b5ae0dd0fdc065








# <<<<<<< HEAD
    return usuario


def usuario_logado_diretor(observador_logado):
    aluno = facade.read_aluno_facade()
    observador = facade.read_observador_facade()
    escola1 = facade.read_escola_facade()
    usuario = []
    for i in aluno:
        if i['vinculo_escola'] is observador_logado['vinculo_escola']:
            escola = facade.search_escola_id_facade(int(i['vinculo_escola']))
            i['tipo'] = tipo_usuario(i['tipo'])
            i['vinculo_escola'] = escola['nome']
            if escola['vinculo_rede'] is not '0' and "":
                rede = facade.search_rede_id_facade(int(escola['vinculo_rede']))
                i['vinculo_rede'] = rede['nome']
            else:
                i['vinculo_rede'] = ""
            usuario.append(i)

    for x in observador:
        if x['tipo'] is not '0' and x['tipo'] is not '1':
            if x['vinculo_escola'] is not '0':
                if x['vinculo_escola'] == observador_logado['vinculo_escola']:
                    escola = facade.search_escola_id_facade(int(x['vinculo_escola']))
                    if int(x['vinculo_escola']) is escola['id']:
                        x['tipo'] = tipo_usuario(x['tipo'])
                        x['vinculo_escola'] = escola['nome']
                    elif escola['vinculo_rede'] is not '0':
                        rede = facade.search_rede_id_facade(int(escola['vinculo_rede']))
                        x['vinculo_rede'] = rede['nome']
                else:
                    x['vinculo_rede'] = ""
                usuario.append(x)

            elif x['vinculo_rede'] is not '0' and None:
                rede = facade.search_rede_id_facade(int(x['vinculo_rede']))
                x['vinculo_escola'] = ""
                x['vinculo_rede'] = rede['nome']
                x['tipo'] = tipo_usuario(x['tipo'])

                usuario.append(x)

    return usuario


def usuario_logado_professor(observador_logado):
    aluno = facade.read_aluno_facade()
    observador = facade.read_observador_facade()
    usuario = []
    for i in aluno:
        if i['vinculo_escola'] is observador_logado['vinculo_escola']:
            escola = facade.search_escola_id_facade(int(i['vinculo_escola']))
            i['tipo'] = tipo_usuario(i['tipo'])
            i['vinculo_escola'] = escola['nome']
            if escola['vinculo_rede'] is not '0':
                rede = facade.search_rede_id_facade(int(escola['vinculo_rede']))
                i['vinculo_rede'] = rede['nome']
            else:
                i['vinculo_rede'] = ""
            usuario.append(i)

    for x in observador:
        if x['tipo'] is not '0' and x['tipo'] is not '1' and x['tipo'] is not '2':
            if x['vinculo_escola'] is not '0':
                print("vinculo escola",x['vinculo_escola'])
                if x['vinculo_escola'] == observador_logado['vinculo_escola']:
                    # print("estou aqui")
                    # print("eis a informaçao q quer:", observador_logado['vinculo_escola'])
                    # print("erro>>", escola_facade.search_escola_id_facade(int(x['vinculo_escola'])))
                    escola = facade.search_escola_id_facade(int(x['vinculo_escola']))
                    print("AAAAA , usuario L303 controler", x['vinculo_rede'],"test")
                    if int(x['vinculo_escola']) is escola['id']:
                        x['tipo'] = tipo_usuario(x['tipo'])
                        x['vinculo_escola'] = escola['nome']
                    if escola['vinculo_rede'] is not '0' and "":
                        print("?? L308 CONTROLER USUSARIO")
                        rede = facade.search_rede_id_facade(int(escola['vinculo_rede']))
                        x['vinculo_rede'] = rede['nome']
                    else:
                        x['vinculo_rede'] = ""
                usuario.append(x)

            elif x['vinculo_rede'] is not '0':
                print("AAAAA , usuario L315 controler", x['vinculo_rede'], "test")
                rede = facade.search_rede_id_facade(int(x['vinculo_rede']))
                x['vinculo_escola'] = ""
                x['vinculo_rede'] = rede['nome']
                x['tipo'] = tipo_usuario(x['tipo'])

                usuario.append(x)

    return usuario
# =======
# >>>>>>> ace753242fd33f3bb17ee18c47b5ae0dd0fdc065
