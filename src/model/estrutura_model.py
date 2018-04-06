from walrus import *

class DbEstrutura(Model):

    db = Database(host='localhost', port=6379, db=0)

    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True, index=True)
    rua = TextField(default=None)
    numero = IntegerField(default=None)
    telefone = TextField(default=None)
    estado = TextField(default=None)
    cidade = TextField(default=None)
    vinculo_rede = TextField(fts=True)
    cod_identificacao = TextField(default=None)
    desempenho = FloatField(default=0)