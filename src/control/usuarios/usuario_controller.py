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











