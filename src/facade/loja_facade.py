from src.model.loja_model import DbLoja

class LojaFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.loja = DbLoja()

    def criar_item_loja_facade(self, nome, tipo, preco):
        """
        Cria o item no banco de dados
        :param nome:nome do item
        :param tipo:Se é cor(1) , rosto(2) , acessorio(3) ou corpo(4)
        :param preco:preço atribuido ao item
        :return:None
        """
        self.loja.create_item(nome, tipo, preco)

    def read_item_loja_facade(self):
        """
        cria uma lista com os itens armazenados na base de dados , com seus valores de id , nome ,tipo e preço
        :return:Lista dos itens criados
        """
        return self.loja.read_item()

    def pesquisa_item_facade(self, id):
        """
        pesquisa itens por id (ainda nao implementado)
        :param id: id do item
        :return: o objeto do item
        """
        return self.loja.pesquisar_item(id)

    def deletar_item(self, id):
        """
        deleta o item por id (ainda nao implementado)
        :param id: o id do item
        :return: None
        """
        self.loja.item_delete(id)

    def ja_tem_item_facade(self, usuario_logado):
        """
        Mostra se o usuario ja comprou o item
        :param usuario_logado:autoexplicativo
        :return:lista de itens q ele nao tem
        """
        return self.loja.ja_possui_item(usuario_logado=usuario_logado)


