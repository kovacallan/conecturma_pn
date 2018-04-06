from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbHistorico(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True)
    tipo = IntegerField()
    data_acesso = DateTimeField(default = datetime.datetime.now)

    def create_historico(self,nome, tipo):
        """
        cria o historico do usuario
        :param nome: nome do usuario que vai ser armazenado o historico
        :param tipo: tipo do usuario
        :return:
        """
        self.create(nome = nome, tipo = tipo)

    def read_historico(self):
        """
        armazena os dados do historico em um dicionario
        :return: mostra o dicionario cheio
        """
        historico = []
        for i in self.query():
            historico.append(dict(nome = i.nome, tipo = i.tipo, data = i.data_acesso))

        return historico