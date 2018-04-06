from src.model.rede_model import DbRede


class RedeFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.rede = DbRede()

    """
        Inicio Facade Rede
    """

    def create_rede_facade(self, nome, cod, telefone):
        """
        cria uma rede no banco de dados
        :param nome: nome da rede
        :param cod: codigo de identificaçao
        :param telefone: telefone da sede
        :return: o rede criada no banco de dados
        """
        return self.rede.create_rede(nome=nome, cod=cod, telefone=telefone)

    def read_rede_facade(self):
        """
        Ver as redes que se encontram no banco d dados . com id , nome , cod e telefone da rede
        :return:a lista de ree com os atributos relevantes da rede a serem mostrados
        """
        return self.rede.read_rede()

    def update_rede_facade(self, id, nome, cod, telefone):
        return self.rede.update_rede(id, nome, cod, telefone)

    def delete_rede_facade(self, ids):
        """
        deleta a rede por uma lista de ids d redes a serem deletados
        :param ids: lista de
        :return:
        """
        return self.rede.delete_rede(ids)

    def search_rede_id_facade(self, id):
        return self.rede.search_rede_id(id=id)

    def pesquisa_rede_facade(self, rede):
        return self.rede.pesquisa_rede(rede)
