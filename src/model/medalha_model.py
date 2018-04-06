from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbMedalha(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField(index=True)
    tipo = IntegerField(default=0)

    def create_medalha(self, nome, tipo):
        """
        cria uma medalha e poe no banco de dados
        :param nome: nome da medalha
        :param tipo: se a medalha é socio-educativa ou de desempenho
        :return:true se tiver criado certinho e false se tiver dado ruim
        """
        if self.create(nome=nome, tipo=tipo):
            return True
        else:
            return TypeError("Não foi possivel salvar a medalha")

    def read_medalha(self):
        """
        armazena os atributos da medalha em uma entrada de dicionario
        :return: o dicionario com os valores
        """
        medalha = []
        for read in DbMedalha.all():
            medalha.append(dict(id=read.id, nome=read.nome,tipo=read.tipo))

        return medalha

    def delete_medalha(self, deletar_ids):
        """
        Deleta as medalhas por id , por enquanto nao implementado

        :param ids: Os ids das medalhas
        :return: None
        """
        for deletar_ids in deletar_ids:
            medalha = self.load(deletar_ids)
            medalha.delete(deletar_ids)

    def pesquisa_medalha(self, nome):
        """
        pesquisa a medalha
        :param nome: nome da medalha
        :return: false se nao achou a medalha e a medalha se achar
        """
        medalha = {}
        for pesquisa in DbMedalha.query(DbMedalha.nome == nome, order_by=DbMedalha.id):
            medalha = pesquisa

        if medalha == '' and medalha is None:
            return False
        else:
            return medalha

    def update_medalha(self, nome):
        """
        edita o nome da medalha
        :param nome: nome da medalha
        :return:
        """
        medalha = DbMedalha.load(id)
        if medalha.nome == nome:
            pass
        else:
            medalha.nome = nome
        medalha.save()

    # def ja_possui_medalha(self, usuario_logado):
    #     """
    #
    #     """
    #     usuario = DbAluno()
    #     itens_usuario = [x.decode('utf-8') for x in
    #                      usuario.pesquisa_usuario(usuario_nome=usuario_logado).itens_comprados]
    #     itens = [str(y['id']) for y in self.read_item()]
    #     lista_teste = [z for z in itens if z not in itens_usuario]
    #
    #     return lista_teste