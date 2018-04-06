from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbRede(Model):
    __database__ = db

    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True, index=True)
    cod = TextField()
    telefone = TextField()

    def create_rede(self, nome, cod, telefone):
        """
        Cria rede com nome , código da rede e o telefone
        :param nome: nome da rede
        :param cod: Codigo de identificaçao de rede
        :param telefone: telefone da rede da rede
        :return: True se conseguir criar e false se der alguém erro
        """
        if self.create(nome=nome, cod=cod, telefone=telefone):
            return True
        else:
            return False

    def read_rede(self):
        """
        Cria uma lista que coloca os valores a ser mostrados pela rede
        :return: a lista
        """

        redes = []
        for rede in self.query(order_by=self.id):
            redes.append(
                dict(id=rede.id, nome=rede.nome, cod=rede.cod, telefone=rede.telefone))

        return redes

    def update_rede(self, id, nome, cod, telefone):
        """
        Pega o id da rede a ser modificada , o novo nome , o novo codigo de identificaçao e o novo telefone da sededa rede

        :param id: id da rede que vai ser mudada
        :param nome:novo nome da rede para trocar
        :param cod: codigo de identificaçao da rede
        :param telefone:telefone da sede da rede
        :return:
        """
        rede = self.load(id)
        if nome == "" or nome == None:
            pass
        else:
            rede.nome = nome
        if cod == "" or cod == None:
            pass
        else:
            rede.cod = cod
        if telefone == "" or telefone == None:
            pass
        else:
            rede.telefone = telefone

        rede.save()

    def delete_rede(self, deletar_ids):
        """
        deleta as redes por lista de ids
        :param deletar_ids:lista de ids das redes a serem deletadas
        :return:None
        """
        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def pesquisa_rede(self, rede):
        """
        pesquisa a rede pelo nome e coloca os dados da rede em uma lista
        :param rede: nome da rede
        :return: retorna a entrada de dicionario com a rede
        """

        rede_pesquisa = None
        for pesquisa in DbRede.query(DbRede.nome == rede, order_by=self.id):
            rede_pesquisa = pesquisa

        return rede_pesquisa
