"""Programa usado para gerar o arquivo rotas.py """

file = open("rotas.py", "w")

file.write("from bottle import route, template \n \n")
file.write('@route("/GLOBAL/player/")\n')
file.write('def av1_mapa4(): \n')
file.write('    return template("jogo/GLOBAL/player/index.html") \n\n\n')
file.write('@route("/UV1/UV1MAPA/")\n\
def mapa_universo():\n\
    return template("jogo/UV1/UV1MAPA/index.html")\n\n\n\
')

for av in range(1, 4):
    file.write('"""----------------------------Mapa da aventura {}----------------------------------------"""\n\n\n'.format(av))

    file.write('@route("/UV1/UV1AV{}/UV1AV{}MAPA/")\n'.format(av, av))
    file.write('def mapa_aventura_{}():\n'.format(av))
    file.write('    return template("jogo/UV1/UV1AV{}/UV1AV{}MAPA/index.html")\n\n\n'.format(av, av))

    for ud in range(1, 9):
        rota_ate_un = '/UV1/UV1AV{}/UV1AV{}UD{}/UV1AV{}UD{}'.format(av, av, ud, av, ud)
        file.write('"""----------------------------Semana {} Aventura {}----------------------------------------"""\n\n\n'.format(ud, av))
        file.write('@route("{}MAPA/")\n'.format(rota_ate_un))
        file.write('def mapa_ud_{}_aventura_{}():\n'.format(ud, av))
        file.write('	return template("jogo{}MAPA/index.html")\n\n'.format(rota_ate_un))

        for oa in range(1, 7):
            file.write('@route("{}OA0{}/")\n'.format(rota_ate_un, oa))
            file.write('def oa{}_ud{}_aventura{}():\n'.format(oa, ud, av))
            file.write('	return template("jogo{}OA0{}/index.html")\n\n'.format(rota_ate_un, oa))

file.close()
