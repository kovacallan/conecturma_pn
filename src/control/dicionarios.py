TIPO_USUARIOS = dict(
    administrador='0',
    gestor='1',
    diretor='2',
    professor='3',
    responsavel='4',
    responsavel_varejo='5',
    aluno='6',
    aluno_varejo='7'
)

TIPO_USUARIOS_ID = {
    '7':'ALUNO VAREJO',
    '6':'ALUNO',
    '5':'RESPONSAVEL VAREJO',
    '4':'RESPONSAVEL',
    '3':'PROFESSOR',
    '2':'DIRETOR',
    '1':'GESTOR',
    '0':'ADMINISTRADOR'
}

SERIE = {
    '0':'Pré-escola',
    '1':'1ª Ano',
    '2':'2ª Ano',
    '3':'3ª Ano',
    '4':'4ª Ano',
    '5':'5ª Ano'
}

PAGINA_INICIAL = dict(
    administrador='/administrador/pag_administrador',
    gestor='/gestao_aprendizagem',
    diretor='/gestao_aprendizagem',
    professor='/gestao_aprendizagem',
    responsavel='/gestao_aprendizagem',
    responsavel_varejo='/gestao_aprendizagem',
    aluno='/aluno/area_aluno',
    aluno_varejo='/aluno/area_aluno'
)

PAGINA_DE_CADASTRO_POR_TIPO = {
    '1':'/observador/cadastro?tipo_observador=1',
    '2':'/observador/cadastro?tipo_observador=2',
    '3':'/observador/cadastro?tipo_observador=3',
    '6':'/aluno/cadastro_aluno'
}

TIPO_ESTRUTURA = dict(
    rede='1',
    escola='2',
    turma='3',
    item='4',
    medalha='5',
    historico='6',
    descritores='7',
    objeto_de_aprendizagem='8'
)

UNIDADES = {
    '1': 'Unidade 1',
    '2': 'Unidade 2',
    '3': 'Unidade 3',
    '4': 'Unidade 4',
    '5': 'Unidade 5',
    '6': 'Unidade 6',
    '7': 'Unidade 7',
    '8': 'Unidade 8'
}

