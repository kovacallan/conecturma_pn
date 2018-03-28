from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbRede(Model):
    __database__ = db

    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True, index=True)
    cod = TextField()
    telefone = TextField()

    def create_rede(self, nome, cod, telefone):
        if self.create(nome=nome, cod=cod, telefone=telefone):
            return True
        else:
            return False

    def read_rede(self):

        redes = []
        for rede in self.query(order_by=self.id):
            redes.append(
                dict(id=rede.id, nome=rede.nome, cod=rede.cod, telefone=rede.telefone))

        return redes

    def update_rede(self, id, nome, cod, telefone):
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
        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def pesquisa_rede(self, rede):

        rede_pesquisa = None
        for pesquisa in DbRede.query(DbRede.nome == rede, order_by=self.id):
            rede_pesquisa = pesquisa

        return rede_pesquisa
