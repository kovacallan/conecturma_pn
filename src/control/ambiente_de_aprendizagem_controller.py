import json

from bottle import route,view, request, redirect, response,get, template
from facade.facade_main import Facade
from control.classes.permissao import permissao, usuario_logado
from control.dicionarios import *

facade=Facade()

@route('/aluno/area_aluno')
@permissao('aluno_varejo')
@view('caminho_aluno/jogar_conecturma')
def view_ambiente_de_aprendizagem():
    """ pagina inicial apos login , que mostra os itens equipados no avatar"""
    if int(usuario_logado()['tipo'])>=6:
        usuario = facade.search_aluno_nome_facade(usuario_logado()['nome'])
    else:
        usuario = facade.search_observador_facade(usuario_logado()['nome'])

    avatar = facade.avatar_facade(usuario['id'])

    avatar_pecas = {
        'cor': facade.search_estrutura_id_facade(avatar['cor'])['nome'],
        'rosto': facade.search_estrutura_id_facade(avatar['rosto'])['nome'],
        'acessorio': facade.search_estrutura_id_facade(avatar['acessorio'])['nome'],
        'corpo': facade.search_estrutura_id_facade(avatar['corpo'])['nome']
    }

    return dict(usuario=usuario['nome'], avatar = avatar_pecas,tipo=usuario_logado()['tipo'])

@route('/aluno/loja')
@permissao('aluno_varejo')
@view('caminho_aluno/index_loja')
def view_ambiente_de_aprendizagem_loja():
    """
    Mostra os itens comprados e os itens disponiveis para serem comprados na mesma pagina
    metodos usados : ja_tem_item_facade, read_estrutura_facade
    :return: um dicionario com os itens comprados e disponiveis , caso um item nao tenha sido criado previamente
    retorna um dicionario vazio"""

    itens_comprados = facade.ver_item_comprado_facade(id_usuario=usuario_logado()['id'])
    itens = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'])

    if itens:
        return dict(itens=itens, itens_comprados=itens_comprados)
    else:
        return dict(itens=False)

@route('/aluno/ver_itens_comprados')
@permissao('aluno_varejo')
@view('caminho_aluno/view_itens')
def ver_itens():
    """
    mostra os itens que o usuario tem posse
    chama os metodos : search_aluno_nome_facade, ver_item_comprado_facade e pesquisa_iten_facade
    cria uma lista com os ids dos itens do aluno
    :return: dicionario de itens
    """

    usuario = usuario_logado()
    itens_comprado = facade.ver_item_comprado_facade(usuario['id'])
    itens = []
    for y in itens_comprado:
        itens.append(facade.search_estrutura_id_facade(int(y)))

    return dict(lista_itens=itens)


@route('/equipar_item', method='POST')
@permissao('aluno_varejo')
def equipar_item():
    """
    Equipar o avatar
    metodos chamados: search_aluno_nome_facade,search_estrutura_by_id e equipar_item_facade
    :return:
    """
    id_item = request.forms['id']
    item = facade.search_estrutura_id_facade(int(id_item))

    facade.equipar_item_facade(usuario_logado()['id'], item)

    redirect('/aluno/ver_itens_comprados')

@route('aluno/ver_item')
@permissao('aluno_varejo')
@view('loja/ver_item')
def ver_item():
    """
    mostra os itens da loja , os ja criados
    :return:o dicionario com o read
    """
    item = facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'])

    return dict(teste=item)

@get('/compras_loja')
@permissao('aluno_varejo')
def compras():
    """
    compra o item que esta na loja
    metodos usados: search_aluno_nome_facade,compra_item_facade
    :return:
    """
    id_item = request.params['id']
    facade.compra_item_facade(id_usuario=usuario_logado()['id'], id_item=id_item)

    redirect('aluno/loja')

@route('/jogo')
def jogo():
    return template('jogo/index')

@route('/api/plataforma/obterUltimaConclusao', method='POST')
def obterUltimaConclusao():
    usuario = usuario_logado()
    retorno={
        'objetoAprendizagem':'',
        'unidade':'',
        'aventura':'',
        'universo':'UV1'
             }
    return retorno

@route('/api/plataforma/verificarAcessoObjetoAprendizagem', method='POST')
def verificarAcessoObjetoAprendizagem():
    parametros = parametros_json_jogos(request.params.items())
    print('2: ', parametros)

    retorno={
        'objetosAprendizagemAcessiveis':["UV1AV1UD1OA01"]
     }

    return retorno

@route('/api/plataforma/verificarConclusoesObjetosAprendizagem', method='POST')
def verificarConclusoesObjetosAprendizagem():
    usuario=usuario_logado()
    parametros = parametros_json_jogos(request.params.items())
    print('3: ', parametros)
    if int(usuario['tipo'])<6:
        retorno={'objetosConcluidos':parametros['objetosAprendizagem']}
    else:
        desempenho_oa = facade.search_oa_concluido_id_aluno_facade(id_aluno=str(usuario['id']))
        if desempenho_oa == []:
            retorno = {'objetosConcluidos': [parametros['objetosAprendizagem'][0]]}
        else:
            proxima_oa = len(desempenho_oa)+1
            print('BB: ', [''.join(parametros['objetosAprendizagem'][i]) for i in range(0, proxima_oa)])
            retorno = {'objetosConcluidos':[''.join(parametros['objetosAprendizagem'][i]) for i in range(0, proxima_oa)]}
    return retorno

@route('/api/plataforma/registrarConclusao', method='POST')
def registrarConclusao():
    from control.dicionarios import PREMIO_JOGOS
    parametros = parametros_json_jogos(request.params.items())
    print('4: ', parametros)
    flag = 0
    oa = parametros['objetoAprendizagem']
    for i in parametros['niveis']:
        if i['termino'] == True:
            flag+=1
    if flag > 1:
        facade.create_oa_concluido_facade(id_aluno=str(usuario_logado()['id']),aventura=oa[3:6],unidade=oa[6:9],
                                          objeto_aprendizagem=oa[9:13])
    return PREMIO_JOGOS[str(flag)]

@route('/api/plataforma/obterPremiacao', method='POST')
def obterPremiacao():
    parametros = parametros_json_jogos(request.params.items())
    print('5: ', parametros)

    retorno={
        'moedas':0,
        'xp':0
    }
    return retorno

@route('/api/plataforma/verificarAcessoUnidade', method='POST')
def verificarAcessoUnidade():
    usuario=usuario_logado()
    parametros = parametros_json_jogos(request.params.items())
    if int(usuario['tipo'])<6:
        retorno={'unidadesAcessiveis':parametros['unidades']}
    else:
        desempenho_aluno = facade.search_oa_concluido_id_aluno_facade(id_aluno=str(usuario['id']))
        if desempenho_aluno == []:
            retorno = {'unidadesAcessiveis': [parametros['unidades'][0]]}
        else:
            desempenho_unidade = facade.unidade_concluida_facade(id_aluno=desempenho_aluno['id_aluno'], unidade=desempenho_aluno['unidade'])
            print("bb aqui meu jovem: ", desempenho_unidade)
            retorno ={'unidadesAcessiveis':[parametros['unidades'][0]] if desempenho_unidade==[] else parametros['unidades']}
    return retorno

@route('/api/plataforma/verificarAcessoAventura', method='POST')
def verificarAcessoAventura():
    usuario = usuario_logado()
    if int(usuario['tipo'])< 6:
        parametros = parametros_json_jogos(request.params.items())
        return {'aventurasAcessiveis': parametros['aventuras']}
    else:
        from control.dicionarios import AVENTURAS_CONECTURMA
        serie_turma = facade.search_estrutura_id_facade(int(usuario['vinculo_turma']))
        return AVENTURAS_CONECTURMA[serie_turma['serie']]


def parametros_json_jogos(parametro):
    for p in parametro:
        parametros = list(p)[0]
    parametros = json.loads(parametros)

    return parametros
