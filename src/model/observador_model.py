from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbObservador(Model):
    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True)
    senha = TextField()
    telefone = TextField()
    cpf = TextField()
    email = TextField()
    tipo = IntegerField()

    def create_observador(self, nome, senha, telefone, cpf, email,tipo):
        if self.create(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email,tipo=tipo):
            return True
        else:
            return False

    def read_observador(self):
        observador = None
        for read in DbObservador.all():
            observador.append(dict(id=read.id, nome=read.nome, senha=read.senha, telefone=read.telefone, cpf=read.cpf,
                                   email=read.email, tipo=read.tipo))

        return observador

    def update_observador(self, id,nome,senha,telefone,cpf,email):

        observador = DbObservador.load(id)
        observador.nome = nome
        observador.senha = senha
        observador.telefone = telefone
        observador.cpf = cpf
        observador.email = email

        observador.save()


    def delete_observador(self):
        pass

    def search_observador(self, nome):

        observador = None
        for search in DbObservador.query(DbObservador.nome == nome):
            observador = search

        return observador
