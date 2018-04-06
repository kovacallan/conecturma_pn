from src.model.historico_model import DbHistorico


class HistoricoFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.historico = DbHistorico()


    def create_historico_facade(self, nome, tipo):
        self.historico.create_historico(nome, tipo)

    def read_historico_facade(self):
        return self.historico.read_historico()


