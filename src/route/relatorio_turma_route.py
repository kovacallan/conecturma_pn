from bottle import route, template, request
from control.classes.permissao import permissao, usuario_logado
from control.observador_controller import Observador
from control.relatorios.relatorio_turma_controller import RelatorioTurma
from control.dicionarios import SERIE
path_template = 'gestao_aprendizagem/relatorios/turma/'


@route('/relatorios/turma')
@permissao('professor')
def relatorio_turma_view(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())
    return template(path_template + 'relatorio_turma', tipo=observador.get_observador_tipo(),
                    turma=observador.get_turma(), teste_serie = SERIE)


@route('/relatorios/visualizar_relatorio_turma')
@permissao('professor')
def relatorio_aluno(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())
    relatorio = RelatorioTurma()
    turma = observador.get_turma(id_turma=request.params['turma'])
    descritores = relatorio.get_descritores(serie=turma['serie'])
    medias = relatorio.get_media_alunos(turma=turma['id'])
    porcentagem = relatorio.get_pontuacao_turma(medias=medias)
    alunos = []
    notas = []
    for index,i in enumerate(descritores):
        nota = []
        for z in medias:
            if z['nome'] not in alunos:
                alunos.append(z['nome'])
            try:
                nota.append(str(z['media'][index]))
            except IndexError:
                nota.append(0)
        notas.append(nota)

    por = []
    for i in porcentagem:
        if i != -1:
            por.append(i)
    porcentagem = por

    print(alunos)

    return template(path_template + 'relatorio_turma_detalhe', media_geral=relatorio.media_geral(porcentagem),
                    media_portugues = relatorio.media_portugues(pontuacao=porcentagem),
                    media_matematica=relatorio.media_matematica(porcentagem), tipo=observador.get_observador_tipo(),
                    alunos=alunos, notas=notas, turma=turma,oa=descritores, porcentagem=porcentagem, teste_serie = SERIE)

@route('/relatorios/relatorio_turma_impressao', method='POST')
def relatorio_impressao():
    from bottle import request
    from control.relatorios.relatorio_escola_controller import RelatorioEscola
    from control.dicionarios import DICIPLINA_NOME

    relatorio = RelatorioTurma()

    observador = Observador(observador_logado=usuario_logado())

    observador.get_turma(id_escola=observador)

    turma = observador.get_turma(id_turma=request.params['turma'])
    descritores = relatorio.get_descritores(serie=turma['serie'])
    medias = relatorio.get_media_alunos(turma=turma['id'])
    porcentagem = relatorio.get_pontuacao_turma(medias=medias)

    #novo for
    oa_mat = []
    pontos_mat = []
    oa_port = []
    pontos_port = []
    teste = 0
    for index,i in enumerate(descritores):
        if i['disciplina'] == DICIPLINA_NOME['matematica']:
            try:
                pontos_mat.append(porcentagem[teste])
                oa_mat.append(float(i['sigla_oa'][8:9] + "." + i['sigla_oa'][12]))
            except:
                pass
            teste+=1
        else:
            if i['sigla_oa'][9:11] != 'VC' and i['sigla_oa'][9:11] != 'CN':
                try:
                    pontos_port.append(porcentagem[teste])
                    oa_port.append(float(i['sigla_oa'][8:9] + "." + i['sigla_oa'][12]))
                except:
                    pass
                teste+=1

    return template(path_template +'relatorio_turma_impressao', turma=turma, oa_mat=oa_mat,
                    oa_port=oa_port, pontos_mat= pontos_mat, pontos_port=pontos_port)


