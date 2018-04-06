from src.model.escola_model import DbEscola

class EscolaFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.escola = DbEscola()


    def create_escola_facade(self, nome, rua, numero, telefone, estado, cidade, vinculo_rede, cod_identificacao):
        return self.escola.create_escola(nome, rua, numero, telefone, estado, cidade, vinculo_rede,
                                         cod_identificacao)

    def read_escola_facade(self):
        return self.escola.read_escola()

    def update_escola_facade(self, id, nome, rua, numero, cidade, estado, telefone, rede_pertencente,
                             cod_identificacao):
        return self.escola.update_escola(id, nome, rua, numero, cidade, estado, telefone, rede_pertencente,
                                         cod_identificacao)

    def delete_escola_facade(self, deletar_ids):
        return self.escola.delete_escola(deletar_ids)

    def search_escola_id_facade(self, id):
        return self.escola.search_escola_id(id=id)

    def pesquisa_escola_facade(self, nome):
        return self.escola.search_escola(nome)

