from model.estrutura_model import DbEstrutura

estrutura='5'

class MedalhaFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.medalha = DbEstrutura()

    def create_medalha_facade(self, nome,tipo):
        return self.medalha.create_estrutura(nome,tipo_medalha=tipo, tipo_estrutura=estrutura)

    def read_medalha_facade(self):
        return self.medalha.read_estrutura(tipo_estrutura=estrutura)

    def delete_medalha_facade(self, delete_ids):
        return self.medalha.delete_estrutura_test(delete_ids)

    def pesquisa_medalha_facade(self, nome):
        return self.medalha.search_estrutura(nome=nome, tipo_estrutura=estrutura)

    def apagartudo(self):
        return self.medalha.darflush()