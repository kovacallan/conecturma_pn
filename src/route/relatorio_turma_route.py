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
    relarotio_aluno = Relatorio()

    turma = observador.get_turma(id_turma=request.params['turma'])
    descritores = relarotio_aluno.get_descritores(serie=turma['serie'])
    for i in relatorio.get_alunos(vinculo_turma=str(turma['id'])):
        desempenho = relarotio_aluno.get_desempenho(descritores=descritores, aluno=i)

    print(desempenho)
    #return template(path_template + 'relatorio_turma_detalhe',tipo=usuario_logado()['tipo'], aluno=relatorio.get_alunos(vinculo_turma=str(turma['id'])), oa=relarotio_aluno.descritores, porcentagem=relarotio_aluno.porcentagem,
    #          pontos=relarotio_aluno.porcentagem_solo,)
