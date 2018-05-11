from model.estrutura_model import DbEstrutura

estrutura = '2'


class EscolaFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.escola = DbEstrutura()

    def create_escola_facade(self, nome, numero, telefone, estado, uf, vinculo_rede, cep):
        return self.escola.create_estrutura(nome=nome, tipo_estrutura=estrutura, telefone=telefone, cep=cep,
                                            estado=estado,
                                            uf=uf, numero=numero, vinculo_rede=vinculo_rede)

    def read_escola_facade(self):
        return self.escola.read_estrutura(tipo_estrutura=estrutura)

    def update_escola_facade(self, id, nome, telefone, vinculo_rede, cep, endereco, numero, cidade, estado):
        return self.escola.update_estrutura(id, nome, telefone, vinculo_rede, cep, endereco, numero, cidade, estado)

    def delete_escola_facade(self, deletar_ids):
        return self.escola.delete_estrutura_test(deletar_ids)

    def search_escola_id_facade(self, id):
        return self.escola.search_estrutura_id(id=id)

    def search_escola_by_rede_facade(self,vinculo_rede):
        return self.escola.search_escola_by_rede(vinculo_rede=vinculo_rede)

    def search_estrutura_rede_id_facade(self, id):
        return self.escola.search_estrutura_rede_id(id=id)

    def search_escola_facade(self, nome):
        return self.escola.search_estrutura(tipo_estrutura=estrutura, nome=nome)

    def apagartudo(self):
        return self.escola.darflush()