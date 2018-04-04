from walrus import *
from model.aluno_model import DbAluno

db = Database(host='localhost', port=6379, db=0)

class DbLoja(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField()
    tipo = IntegerField(default=0)
    preco = IntegerField(default=0)
    media_turma_jogos = FloatField(default=0)

    def create_item(self, nome, tipo, preco):
        """
        Cria o item no banco de dados
        :param nome:Nome do item
        :param tipo:Se ele é cor,rosto,acessório,corpo
        :param preco: é o preço do item
        :return:
        """
        self.create(nome=nome, tipo=tipo, preco=preco)

    def read_item(self):
        """
        Leitura dos itens cadastrados na plataforma
        :return: Os itens cadastrados
        """
        itens = []
        for item in self.query(order_by=self.id):
            itens.append(dict(id=item.id, nome=item.nome, tipo=item.tipo, preco=item.preco))

        if itens != '' and itens != None and itens != 0:
            return itens
        else:
            return False

    def pesquisar_item(self, id):
        """
        Pesquisa por item especifico
        :param id:Id do item
        :return:O objeto que corresponde ao Id
        """

        item = None

        for pesquisa in DbLoja.query(DbLoja.id == id, order_by=DbAluno.id):
            item = pesquisa

        if item == '' and item == None:
            return False
        else:
            return item

    def item_delete(self, id):
        """
        deleta o item por id
        :param id:
        :return: void
        """
        loja = DbLoja(id=id)
        loja.delete()

    def ja_possui_item(self, usuario_logado):
        """
        Envia se o usuario já comprou o item
        :param usuario_logado: Id do usuario
        :return: Lista de itens que o usuario não tem
        """
        usuario = DbAluno()
        itens_usuario = [x.decode('utf-8') for x in
                         usuario.pesquisa_usuario(usuario_nome=usuario_logado).itens_comprados]
        itens = [str(y['id']) for y in self.read_item()]
        lista_teste = [z for z in itens if z not in itens_usuario]

        return lista_teste
