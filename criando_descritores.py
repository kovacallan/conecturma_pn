# -*- coding: utf-8 -*-
import xlrd

file = open("migration.py", "w")
file.write('# -*- coding: utf-8 -*- \n')
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

file.close()
