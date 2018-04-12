from bottle import *
from facade.rede_facade import  RedeFacade
from facade.escola_facade import  EscolaFacade
from facade.aluno_facade import AlunoFacade
from facade.loja_facade import LojaFacade
from facade.observador_facade import ObservadorFacade

rede_facade = RedeFacade()
escola_facade = EscolaFacade()
aluno_facade = AlunoFacade()
loja_facade = LojaFacade()
observador_facade = ObservadorFacade()


@route('/usuario')
@view('usuario/index')
def view_usuario_index():
    """
    Cria o cookie para a sessao atual do aluno
    pagina inicial do aluno
    :return: None
    """
    if request.get_cookie("login", secret='2525'):
        usuarios = controller_usuario_index()
        return dict(usuarios=usuarios)
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

def controller_usuario_index():
    aluno = aluno_facade.read_aluno_facade()
    observador = observador_facade.read_observador_facade()
    usuario = []
    for i in aluno:
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
        if x['tipo'] is not '0':
            if x['vinculo_escola'] is not '0':
                escola = escola_facade.search_escola_id_facade(int(x['vinculo_escola']))
                x['tipo'] = tipo_usuario(x['tipo'])
                x['vinculo_escola'] = escola['nome']
                if escola['vinculo_rede'] is not '0':
                    rede = rede_facade.search_rede_id_facade(int(escola['vinculo_rede']))
                    x['vinculo_rede'] = rede['nome']
                else:
                    x['vinculo_rede'] = ""

            elif x['vinculo_rede'] is not '0':
                rede = rede_facade.search_rede_id_facade(int(x['vinculo_rede']))
                x['vinculo_escola'] = ""
                x['vinculo_rede'] = rede['nome']
                x['tipo'] = tipo_usuario(x['tipo'])

            usuario.append(x)


    return usuario

def tipo_usuario(id_tipo):
    if id_tipo is '1':
        return "GESTOR"
    elif id_tipo is '2':
        return "DIRETOR"
    elif id_tipo is '3':
        return "PROFESSOR"
    elif id_tipo is '6':
        return "ALUNO"