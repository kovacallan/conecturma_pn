from bottle import route, template, request
from control.classes.permissao import permissao, usuario_logado
from control.observador_controller import Observador
from control.relatorio_escola_controller import RelatorioEscola
from control.relatorio_controller import Relatorio

path_template = 'gestao_aprendizagem/relatorios/escola/'


@route('/relatorios/escola')
@permissao('professor')
def relatorio_turma_view(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())
    return template(path_template + 'relatorio_escola', tipo=observador.get_observador_tipo(),
                    escola=observador.get_escola())


@route('/relatorios/visualizar_relatorio_escola')
def relatorio_aluno(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())
    relatorio = RelatorioEscola()
    escola = observador.get_escola()
    serie = request.params['serie']
    descritores = relatorio.get_descritores(serie=serie)
    turmas = observador.get_turma(serie=serie)
    for i in turmas:
        i['mendia']
        media_alunos = relatorio.get_media_alunos(turma=i['id'])
        i['media'].append(relatorio.get_pontuacao_turma(medias=media_alunos))
    turmas = i

    print(turmas)

    #return template(path_template + 'relatorio_turma_detalhe', tipo=observador.get_observador_tipo(), turma=turmas, notas=notas,
     #               escola=escola,oa=descritores, porcentagem=porcentagem)

@route('/relatorios/selecao_serie')
def selecao_serie():
    observador = Observador(observador_logado=usuario_logado())
    return template(path_template + 'relatorio_selecao_serie', tipo=observador.get_observador_tipo())


