from walrus import *

db = Database(host='localhost', port=6379, db=0)

class DbRede(Model):
    __database__= db

    id = AutoIncrementField(primary_key = True)
    nome = TextField()
    cod = TextField()
    telefone = TextField()

    def create_rede(self,nome,cod,telefone):
        if self.create(nome=nome,cod=cod,telefone=telefone):
            return True
        else:
            return False

    def read_rede(self):

        redes = []
        for rede in self.query(order_by=self.id):
            redes.append(
                dict(id=rede.id, nome=rede.nome,cod = rede.cod,telefone = rede.telefone))

        return redes

    def update_rede(self,id,nome):
        rede = self.load(id)
        rede.nome = nome
        rede.save()

    def delete_rede(self,deletar_ids):
        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def pesquisa_rede(self,rede):

        rede = None
        for pesquisa in self.query(self.nome == rede, order_by=self.id):
            rede = pesquisa

        return rede