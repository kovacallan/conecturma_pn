from walrus import *
from random import randrange

db = Database(host='localhost', port=6379, db=0)


class DbHistorico(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome_usuario=TextField(default='0')
    acao=TextField(default='0')
    momento=DateField(default=datetime.datetime.now)

    def create_historico(self, **kwargs):
        print('aqui',locals())
        return self.create(**kwargs)