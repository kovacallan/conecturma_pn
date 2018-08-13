from bottle import *
from walrus import *
from facade.facade_main import *
from control.dicionarios import *

facade=Facade()

def create_migration_aux():

    for x in range(0,10):
        if x%3==0:
            facade.create_observador_facade(nome='professor'+x ,senha='123'+x,telefone='telefone', email=x+'email@email.seila',tipo=TIPO_USUARIOS['professor'],escola='escola',vinculo_turma='turma_1a')
        elif x%5 ==0:
            facade.create_observador_facade(nome='professor' + x, senha='123' + x, telefone='telefone',
                                            email='email@email' + x + 'seila', tipo=TIPO_USUARIOS['professor'],
                                            escola='escola', vinculo_turma='turma_2a')
        elif x%7:
            facade.create_observador_facade(nome='professor' + x, senha='123' + x, telefone='telefone',
                                            email='email@email' + x + 'seila', tipo=TIPO_USUARIOS['professor'],
                                            escola='escola', vinculo_turma='turma_3a')
        else:
            facade.create_observador_facade(nome='professor' + x, senha='123' + x, telefone='telefone',
                                            email='email@email' + x + 'seila', tipo=TIPO_USUARIOS['professor'],
                                            escola='escola', vinculo_turma='turma_4a')

    for x in range(0, 20):
        if x % 3 == 0:
            facade.create_aluno_facade(nome='aluno'+x ,matricula="234522"+x ,nome_login="aluno"+x , senha="abcd",email="tent@cul.com"+x,vinculo_escola="escola",vinculo_turma='turma_1a')
        elif x % 5 == 0:

            facade.create_aluno_facade(nome='aluno' + x, matricula="234522" + x, nome_login="aluno" + x, senha="abcd",
                                       email="tent@cul.com" + x, vinculo_escola="escola", vinculo_turma='turma_2a')
        elif x%15==0:
            facade.create_aluno_facade(nome='aluno' + x, matricula="234522" + x, nome_login="aluno" + x, senha="abcd",
                                       email="tent@cul.com" + x, vinculo_escola="escola", vinculo_turma='turma_3a')
        else:
            facade.create_aluno_facade(nome='aluno' + x, matricula="234522" + x, nome_login="aluno" + x, senha="abcd",
                                       email="tent@cul.com" + x, vinculo_escola="escola", vinculo_turma='turma_4a')
