from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbHistorico(Model):
    __database__ =  db
    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True)
    tipo = TextField(fts=True)
    data_acesso = DateTimeField(default = datetime.datetime.now)

    def create_historico(self,nome, tipo):
        self.create(nome = nome, tipo = tipo)

    def read_historico(self):
        historico = []
        for i in self.query():
            historico.append(dict(nome = i.nome, tipo = i.tipo, data = i.data_acesso))

        return historico