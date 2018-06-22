# -*- coding: utf-8 -*-
import xlrd

file = open("migration.py", "w")

def xlread(arq_xls):
    """
    Gerador que le arquivo .xls
    """

    # Abre o arquivo
    xls = xlrd.open_workbook(arq_xls)
    # Pega a primeira planilha do arquivo
    plan = xls.sheets()[0]

    # Para i de zero ao numero de linhas da planilha
    for i in range(plan.nrows):
        # Le os valores nas linhas da planilha
        yield plan.row_values(i)


for linha in xlread('oas.xls'):
    print(linha)
    file.write('facade.create_estrutura_facade(tipo_estrutura="7", nome="{}", sigla_oa="{}", descricao="{}", \
tipo_oa= TIPO_OAS_ID["{}"], unidade="{}", sigla_descritor="{}", nome_descritor="{}", \
descricao_descritor="{}", serie="{}", disciplina="{}")\n'.format(linha[1], linha[0], linha[2], linha[3], int(linha[4]),
                                                                     linha[5], linha[6], linha[7],1 ,2 if linha[9]==2.0 else 1))

file.close()
