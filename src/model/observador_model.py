from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbObservador(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True)
    senha = TextField()
    telefone = TextField()
    cpf = TextField()
    email = TextField()
    tipo = IntegerField()
    vinculo_rede = IntegerField(default=0)
    vinculo_escola = IntegerField(default=0)
    data_ultimo_login = TextField()

    def create_observador(self, nome, senha, telefone, cpf, email, tipo, rede, escola):
        if self.create(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo, vinculo_rede=rede,
                       vinculo_escola=escola):
            return True
        else:
            return False

    def read_observador(self):
        observador = []
        for read in DbObservador.all():
            observador.append(dict(id=read.id, nome=read.nome, senha=read.senha, telefone=read.telefone, cpf=read.cpf,
                                   email=read.email, tipo=read.tipo, escola=read.vinculo_escola))

        return observador

    def update_observador(self, id, nome, telefone, cpf, email):

        observador = DbObservador.load(id)
        observador.nome = nome
        observador.telefone = telefone
        observador.cpf = cpf
        observador.email = email

        observador.save()

    def delete_observador(self, deletar_ids):
        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def search_observador_id(self, id):
        observador = self.load(id)

        return observador

    def search_observador(self, nome):

        observador = None
        for search in DbObservador.query(DbObservador.nome == nome):
            observador = dict(id=search.id, nome=search.nome, senha=search.senha, telefone=search.telefone,
                              cpf=search.cpf, email=search.email, tipo=search.tipo)

        return observador

    def login_date(self, id, data):
        observador = self.load(id)
        observador.data_login = data
        observador.save()
