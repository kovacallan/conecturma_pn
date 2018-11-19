from bottle import route, template, request
from control.classes.permissao import permissao, usuario_logado
from control.observador_controller import Observador
from control.relatorios.relatorio_rede_controller import RelatorioRede

path_template = 'gestao_aprendizagem/relatorios/rede/'


@route('/relatorios/rede')
@permissao('professor')
def relatorio_turma_view(no_repeat=False):
    pass

@route('/relatorios/visualizar_relatorio_rede')
def relatorio_aluno(no_repeat=False):
    pass

@route('/relatorios/selecao_serie')
def selecao_serie():
    pass

