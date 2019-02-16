from bottle import route, template, request
from control.permissao import permissao, usuario_logado
from control.observador_controller import Observador
from control.relatorios.relatorio_rede_controller import RelatorioRede
from control.relatorios.relatorio_escola_controller import RelatorioEscola

path_template = 'gestao_aprendizagem/relatorios/rede/'



@route('/relatorios/rede')
@permissao('gestor')
def relatorio_turma_view(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())

    return template(path_template + 'relatorio_rede', tipo=observador.get_observador_tipo(),
                    rede=observador.get_rede())


@route('/relatorios/visualizar_relatorio_rede')
@permissao('gestor')
def relatorio_aluno(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())

    relatorio = RelatorioRede()
    escola_relatorio = RelatorioEscola()

    serie = request.params['serie']
    redes = request.params['rede']
    rede = observador.get_rede(id_rede=redes)
    descritores = relatorio.get_descritores(serie=serie)
    escola_relatorio._descritores = descritores
    escolas = observador.get_escola(id_rede=rede['id'])
    escola = []
    media_escola = []
    notas = []
    for index,i in enumerate(escolas):
        turmas = observador.get_turma(serie=serie, id_escola=i['id'])
        turma = []
        i['media'] = []
        for n in turmas:
            media_alunos = escola_relatorio.get_media_alunos(turma=n['id'])
            n['media']=[]
            for z in escola_relatorio.get_pontuacao_turma(medias=media_alunos):
                if z != -1:
                    n['media'].append(int(z))
                    i['media'].append(int(z))
                else:
                    n['media'].append(0)
                    i['media'].append(0)
            turma.append(n)
        media_escola.append(relatorio.get_media_escola(turma_media=turma, descritor=descritores))

    print(escolas)
    for index, i in enumerate(descritores):
        nota = []
        for z in escolas:
            if z['nome'] not in escola:
                escola.append(z['nome'])
            try:
                nota.append(str(z['media'][index]))
            except IndexError:
                pass
        notas.append(nota)
    
    media_rede = relatorio.get_media_rede(escola_media=media_escola, descritor=descritores)
    return template(path_template + 'relatorio_rede_detalhe', media_geral = relatorio.media_geral(pontuacao=media_escola),
                    media_portugues=relatorio.media_portugues(pontuacao=media_escola),media_matematica=relatorio.media_matematica(pontuacao=media_escola),
                    tipo=observador.get_observador_tipo(),turma=escola, notas=notas, escola=rede,
                    porcentagem=media_rede, oa=descritores, serie=serie)

@route('/relatorios/selecao_serie_rede')
@permissao('gestor')
def selecao_serie():
    observador = Observador(observador_logado=usuario_logado())

    return template(path_template + 'relatorio_selecao_serie', tipo=observador.get_observador_tipo(), rede=request.params['id'])


@route('/relatorios/relatorio_rede_impressao', method='POST')
def relatorio_impressao():
    from bottle import request
    from control.relatorios.relatorio_escola_controller import RelatorioEscola
    from control.dicionarios import DICIPLINA_NOME

    relatorio = RelatorioEscola()
    escola_relatorio = RelatorioEscola()

    observador = Observador(observador_logado=usuario_logado())

    observador.get_turma(id_escola=observador)

    rede = observador.get_rede(id_rede=request.params['rede'])
    serie = request.params['serie']
    descritores = relatorio.get_descritores(serie=request.params['serie'])

    escola_relatorio._descritores = descritores

    escolas = observador.get_escola(id_rede=rede['id'])

    escola = []
    media_escola = []
    notas = []
    for index, i in enumerate(escolas):
        turmas = observador.get_turma(serie=serie, id_escola=i['id'])
        turma = []
        i['media'] = []
        for n in turmas:
            media_alunos = escola_relatorio.get_media_alunos(turma=n['id'])
            n['media'] = []
            for z in escola_relatorio.get_pontuacao_turma(medias=media_alunos):
                if z != -1:
                    n['media'].append(int(z))
                    i['media'].append(int(z))
                else:
                    n['media'].append(0)
                    i['media'].append(0)
            turma.append(n)
        media_escola = relatorio.get_media_escola(turma_media=turma, descritor=descritores)

    #novo for
    oa_mat = []
    pontos_mat = []
    oa_port = []
    pontos_port = []
    teste = 0
    for index,i in enumerate(descritores):
        if i['disciplina'] == DICIPLINA_NOME['matematica']:
            try:
                if media_escola[teste] > 0:
                    pontos_mat.append(media_escola[teste])
                    oa_mat.append(float(i['sigla_oa'][8:9] + "." + i['sigla_oa'][12]))
            except:
                pass
            teste+=1
        else:
            if i['sigla_oa'][9:11] != 'VC' and i['sigla_oa'][9:11] != 'CN':
                try:
                    if media_escola[teste] > 0:
                        pontos_port.append(media_escola[teste])
                        oa_port.append(float(i['sigla_oa'][8:9] + "." + i['sigla_oa'][12]))
                except:
                    pass
                teste+=1
    return template(path_template +'relatorio_rede_impressao', media_matematica=media_escola,
                    media_portugues=media_escola, escola=rede, oa_mat=oa_mat,
                    oa_port=oa_port, pontos_mat= pontos_mat, pontos_port=pontos_port)

