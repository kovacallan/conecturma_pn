from bottle import route, template,request
from control.classes.permissao import permissao, usuario_logado
from control.observador_controller import Observador
from control.relatorio_turma_controller import RelatorioTurma
from control.relatorio_controller import Relatorio

path_template = 'gestao_aprendizagem/relatorios/turma/'

@route('/relatorios/turma')
@permissao('professor')
def relatorio_turma_view(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())
    return template(path_template + 'relatorio_turma', tipo=observador.get_observador_tipo(), turma=observador.get_turma())

@route('/relatorios/visualizar_relatorio_turma')
def relatorio_aluno(no_repeat=False):
    observador = Observador(observador_logado=usuario_logado())
    relatorio = RelatorioTurma()
    turma = observador.get_turma(id_turma=request.params['turma'])
    descritores = relatorio.get_descritores(serie=turma['serie'])
    medias = relatorio.get_media_alunos(turma=turma['id'])
    porcentagem = relatorio.get_pontuacao_turma(medias=medias)

    return template(path_template + 'relatorio_turma_detalhe', tipo = observador.get_observador_tipo(), turma = turma,
                    oa = descritores, porcentagem = porcentagem)
