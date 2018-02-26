from walrus import *

db = Database(host='localhost', port=6379, db=0)


# class DbAluno será usada como Usuario generico no spike
class DbUsuario(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    usuario_nome = TextField(fts=True, index=True)
    usuario_senha = TextField()

    def create_usuario(self, nome, senha):
        self.create(usuario_nome=nome, usuario_senha=senha)

    def read_usuario(self):

        usuario_dic = {'id': [], 'usuario_nome': [], 'usuario_senha': []}

        for aluno in self.query(order_by=self.usuario_nome):
            usuario_dic['id'].append(aluno.id)
            usuario_dic['usuario_nome'].append(aluno.usuario_nome)
            usuario_dic['usuario_senha'].append(aluno.usuario_senha)
        return usuario_dic

    def pesquisa_usuario(self, nome):
        usuario_dic = {'id': 0, 'nome': '', 'senha': ''}

        for pesquisa in DbUsuario.query(DbUsuario.usuario_nome == nome, order_by=DbUsuario.id):
            usuario_dic['id'] = pesquisa.id
            usuario_dic['nome'] = pesquisa.usuario_nome
            usuario_dic['senha'] = pesquisa.usuario_senha

        if usuario_dic['id'] == 0:
            return False
        else:
            return usuario_dic

    def aluno_delete(self, usuario):
        teste = DbUsuario(id = usuario)
        teste.delete()


class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)

    def create_turma(self, turma):
        return self.create(turma_nome=turma)

    def read_turma(self):
        return self.query(order_by=self.id)