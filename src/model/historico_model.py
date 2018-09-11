from walrus import *
from random import randrange

db = Database(host='localhost', port=6379, db=0)


class DbHistorico(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome_usuario=TextField(default='0', index=True,fts=True)
    acao=TextField(default='0',index=True)
    momento=DateTimeField(default=datetime.datetime.now,index=True)

    def create_historico(self, **kwargs):
        self.create(**kwargs)

    def read_historico(self):
        historico = []
        for search in DbHistorico.query(order_by=DbHistorico.id):
            historico.append(
                dict(
                    id=search.id, nome_usuario=search.nome_usuario,acao=search.acao,momento=search.momento
                )
            )

        return reversed(historico)

    def update_historico(self,**kwargs):
        '''
        Em progresso , mas servira basicamente para armazenar os dados de criaçao e modificaçao de tudo.
        :param kwargs:
        :return:
        '''
        new_data_historico = kwargs['historico']
        estrutura = self.load(int(new_data_historico['id']))
        for i in new_data_historico:
            if new_data_historico[i] and new_data_historico[i] != ' ':
                setattr(estrutura, i, new_data_historico[i])
        if estrutura.save():
            return True
        else:
            return False


    def search_historico_nome(self, nome):
        listas = []

        for lista in DbHistorico.query((DbHistorico.nome_usuario == nome),
                                       order_by=DbHistorico.id):
            listas.append(vars(lista)["_data"])

        return listas