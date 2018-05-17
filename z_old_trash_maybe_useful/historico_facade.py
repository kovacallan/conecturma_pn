from model.estrutura_model import DbEstrutura

estrutura='6'

class HistoricoFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.historico = DbEstrutura()


    def create_estrutura_facade(self, nome, tipo):
        self.historico.create_estrutura(nome=nome, tipo_estrutura=estrutura, tipo_usuario=tipo)

    def read_historico_facade(self):
        return self.historico.read_estrutura(tipo_estrutura=estrutura)


