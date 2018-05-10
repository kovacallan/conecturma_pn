from bottle import route, request, template
from facade.facade_main import Facade

facade = Facade()


@route('/filtro/filtro_usuario', method='POST')
def filtro_usuario():
    rede = request.params['rede']
    escola = request.params['escola']
    turma = request.params['turma']
    tipo_usuario = request.params['tipo_usuario']
    observador_logado = facade.search_observador_facade(request.get_cookie("login", secret='2525'))

    if rede == '0':
        if escola == '0':
            if turma == '0':
                if tipo_usuario == '0':
                    usuarios = retorna_todos(observador_logado['tipo'], observador_logado['vinculo_escola'])
                else:
                    usuarios = pesquisar_usuario_por_tipo(tipo_usuario=tipo_usuario)
            else:
                usuarios = pesquisa_usuario_in_turma(turma, tipo_usuario)
        else:
            usuarios = pesquisa_usuario_in_escola(vinculo_escola=escola, vinculo_turma=turma, tipo_usuario=tipo_usuario)
    else:
        usuarios = pesquisa_usuario_in_rede(vinculo_rede=rede, vinculo_escola=escola, vinculo_turma=turma, tipo_usuario=tipo_usuario)

    return template('bottle/usuario/bottle_usuario_read_usuarios.tpl',
                    usuarios=usuarios, observador_tipo=observador_logado)


def pesquisar_usuario_por_tipo(tipo_usuario):
    if tipo_usuario != '6':
        usuarios = facade.search_observador_tipo_facade(tipo_usuario)
    else:
        usuarios = facade.read_aluno_facade()

    return usuarios


def pesquisa_usuario_in_turma(turma, tipo_usuario):
    if tipo_usuario != '0' and turma != '0':
        if tipo_usuario == '6':
            usuarios = facade.search_aluno_by_turma_facade(vinculo_turma=turma)

        else:
            if tipo_usuario == '3':
                usuarios = facade.search_observador_turma(vinculo_turma=turma)
            else:
                usuarios = "Não tem ninguem cadastrado =("
    elif turma != '0' and tipo_usuario == '0':
        usuarios = []
        for a in facade.search_aluno_by_turma_facade(vinculo_turma=turma):
            usuarios.append(a)
        for o in facade.search_observador_turma(vinculo_turma=turma):
            usuarios.append(o)

    return usuarios


def pesquisa_usuario_in_escola(vinculo_escola, vinculo_turma, tipo_usuario):
    if vinculo_turma != '0':
        if tipo_usuario != '0':
            usuarios = []
            for u in pesquisar_usuario_por_tipo(tipo_usuario):
                print(u)
                if u['vinculo_turma'] == vinculo_turma and u['vinculo_escola'] == vinculo_escola:
                    usuarios.append(u)
        else:
            if vinculo_turma != '0':
                usuarios = []
                for u in pesquisa_usuario_in_turma(vinculo_turma, tipo_usuario):
                    usuarios.append(u)
            else:
                usuarios = []
                for a in facade.search_aluno_escola_facade(id_escola=vinculo_escola):
                    usuarios.append(a)

                for o in facade.search_observador_escola_filtro_facade(vinculo_escola=vinculo_escola):
                    usuarios.append(o)
    else:
        if tipo_usuario != '0':
            usuarios = []
            for u in pesquisar_usuario_por_tipo(tipo_usuario):
                if u['vinculo_escola'] == vinculo_escola:
                    usuarios.append(u)
        else:
            usuarios = []
            for a in facade.search_aluno_escola_facade(id_escola=vinculo_escola):
                usuarios.append(a)

            for o in facade.search_observador_escola_filtro_facade(vinculo_escola=vinculo_escola):
                usuarios.append(o)

    return usuarios

def pesquisa_usuario_in_rede(vinculo_rede, vinculo_escola, vinculo_turma, tipo_usuario):
    if vinculo_escola != '0':
        if vinculo_turma != '0':
            if tipo_usuario != '0':
                usuarios = []
                for u in pesquisa_usuario_in_escola(vinculo_escola=vinculo_escola, vinculo_turma=vinculo_turma,tipo_usuario=tipo_usuario):
                    if u['vinculo_rede'] == vinculo_rede:
                        print(u)
    else:
        escola = facade.search_escola_by_rede_facade(vinculo_rede=vinculo_rede)
        usuarios = []
        for e in escola:
            for a in facade.search_aluno_escola_facade(id_escola=str(e['id'])):
                usuarios.append(a)
            for o in facade.search_observador_escola_filtro_facade(vinculo_escola=vinculo_escola):
                usuarios.append(o)

    return usuarios

def retorna_todos(tipo_observador, vinculo_escola):
    aluno = facade.read_aluno_facade()
    observador = facade.search_observador_escola_listagem_facade(login=tipo_observador, vinculo_escola=vinculo_escola)
    usuario = []
    for a in aluno:
        usuario.append(a)
    for o in observador:
        usuario.append(o)

    return usuario
