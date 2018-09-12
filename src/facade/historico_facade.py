from model.historico_model import DbHistorico


class HistoricoFacade:

    def __init__(self):
        self.historico = DbHistorico()

    def create_historico_facade(self,**kwargs):
        return self.historico.create_historico(**kwargs)

    def update_historico_facade(self,**kwargs):
        '''
        futuro para acrescentar os dados de criaçao das coisas e os internos das funçoes usadas
        '''
        return self.historico.update_historico(**kwargs)

    def read_historico_facade(self):
        return self.historico.read_historico()

    def historico_de_dados_cadastrados_facade(self,hist_id,dicionari):
        return self.historico.hist_dados_cadastrado(hist_id,dicionari)

    def search_historico_nome_facade(self,nome):
        return self.historico.search_historico_nome(nome)

    def search_historico_acao_facade(self,acao):
        return self.historico.search_historico_acao(acao)