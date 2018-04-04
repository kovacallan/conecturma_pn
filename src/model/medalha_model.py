from walrus import *
import model.aluno_model

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
        :return:
        """
        if self.create(nome=nome, tipo=tipo):
            return True
        else:
            return TypeError("Não foi possivel salvar a turma")

    def read_medalha(self):

        medalha_dic = []

        for medalha in self.query(order_by=self.id):
            medalha_dic.append(
                dict(id=medalha.id, nome=medalha.nome, tipo=medalha.tipo))

        return medalha_dic

    def delete_medalha(self, deletar_ids):
        """
        Deleta as turmas por id , por enquanto nao implementado

        :param id: O id da turma
        :return: None
        """
        for deletar_ids in deletar_ids:
            medalha = self.load(deletar_ids)
            medalha.delete(deletar_ids)

    def pesquisa_medalha(self, nome):
        """
        Ainda nao implementado
        :return:
        """
        medalha = {}
        for pesquisa in DbMedalha.query(DbMedalha.nome == nome, order_by=DbMedalha.id):
            medalha = pesquisa

        if medalha == '' and medalha is None:
            return False
        else:
            return medalha

    def update_medalha(self, nome):
        medalha = DbMedalha.load(id)
        if medalha.nome == nome:
            pass
        else:
            medalha.nome = nome
        medalha.save()

    def ja_possui_item(self, usuario_logado):
        """

        """
        usuario = DbAluno()
        itens_usuario = [x.decode('utf-8') for x in
                         usuario.pesquisa_usuario(usuario_nome=usuario_logado).itens_comprados]
        itens = [str(y['id']) for y in self.read_item()]
        lista_teste = [z for z in itens if z not in itens_usuario]

        return lista_teste