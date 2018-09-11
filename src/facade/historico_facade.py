from model.historico_model import DbHistorico


class HistoricoFacade:

    def __init__(self):
        self.historico = DbHistorico()

    def create_historico_facade(self,**kwargs):
        return self.historico.create_historico(**kwargs)

    def update_historico_facade(self,**kwargs):
        return self.historico.update_historico(**kwargs)

    def read_historico_facade(self):
        return self.historico.read_historico()

    def search_historico_nome_facade(self,nome):
        return self.historico.search_historico_nome(nome)