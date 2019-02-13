from walrus import *

class Usuario(object):
    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True, index=True)
    senha = TextField(default='0')
    email = TextField(fts=True, default='0')
    apelido = TextField(fts=True, default='0')

    armario = ListField()
    cor = TextField(default='0')
    rosto = TextField(default='0')
    acessorio = TextField(default='0')
    corpo = TextField(default='0')

    vinculo_rede = TextField(fts=True, default='0')
    vinculo_escola = TextField(fts=True, default='0')
    vinculo_turma = TextField(fts=True, default='0')

    pontos_de_vida = IntegerField(default=0)
    pontos_de_moedas = IntegerField(default=0)