from bottle import *
from walrus import *
from facade.facade_main import *
from control.dicionarios import *

facade=Facade()

facade.create_estrutura_facade(nome='escola',tipo_estrutura=TIPO_ESTRUTURA['escola'],telefone='21 55555555', cnpj='054782548')

for x in range(0,4):
    facade.create_estrutura_facade(nome="nome" + str(x), vinculo_escola='1',)
for x in range(0,10):
    if x%3==0:

        facade.create_observador_facade(nome='professor'+ str(x)
                                        ,senha='123'+str(x),
                                        telefone='telefone',
                                        email='email@email.seila'+str(x),
                                        tipo=TIPO_USUARIOS['professor'],
                                        escola='1',vinculo_turma='2')
    elif x%5 ==0:

        facade.create_observador_facade(nome='professor' +str(x), senha='123' +str(x), telefone='telefone',
                                        email='email@email' +str(x) + 'seila', tipo=TIPO_USUARIOS['professor'],
                                        escola='1', vinculo_turma='3')
    elif x%7:
        facade.create_observador_facade(nome='professor' + str(x), senha='123' + str(x), telefone='telefone',
                                        email='email@email' + str(x) + 'seila', tipo=TIPO_USUARIOS['professor'],
                                        escola='1', vinculo_turma='4')
    else:
        facade.create_observador_facade(nome='professor' + str(x), senha='123' + str(x), telefone='telefone',
                                        email='email@email' + str(x) + 'seila', tipo=TIPO_USUARIOS['professor'],
                                        escola='1', vinculo_turma='5')

for x in range(0, 20):
    if x % 3 == 0:
        facade.create_aluno_facade(nome='aluno'+str(x) ,matricula="234522"+str(x) ,nome_login="aluno"+str(x) , senha="abcd",email="tent@cul.com"+str(x),vinculo_escola="1",vinculo_turma='2')
    elif x % 5 == 0:
        facade.create_aluno_facade(nome='aluno' + str(x), matricula="234522" + str(x), nome_login="aluno" + str(x),
                                   senha="abcd", email="tent@cul.com" + str(x), vinculo_escola="1",
                                   vinculo_turma='3')
    elif x%15==0:
        facade.create_aluno_facade(nome='aluno' + x, matricula="234522" + x, nome_login="aluno" + x, senha="abcd",
                                   email="tent@cul.com" + x, vinculo_escola="1", vinculo_turma='4')
    else:
        facade.create_aluno_facade(nome='aluno' + str(x), matricula="234522" + str(x), nome_login="aluno" + str(x),
                                   senha="abcd", email="tent@cul.com" + str(x), vinculo_escola="1",
                                   vinculo_turma='5')
