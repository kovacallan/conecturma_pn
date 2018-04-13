from walrus import *
from src.model.aluno_model import DbAluno

db = Database(host='localhost', port=6379, db=0)


class DbEstrutura(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField()
    tipo_estrutura = TextField(fts=True, index=True)
    telefone = TextField(default=None)
    vinculo_rede = TextField(default=None)
    vinculo_escola = TextField(default=None)
    cep = TextField(default=None)
    endereco = TextField(default=None)
    numero = TextField(default=None)
    estado = TextField(default=None)
    uf = TextField(default=None)
    quem_criou = TextField(default=None)
    serie = TextField(default=None)
    tipo_item = TextField(default=None)
    preco = IntegerField(default=0)
    tipo_medalha = TextField(default=None)
    descricao = TextField(default=None)
    descricao_completa = TextField(default=None)
    nome_usuario = TextField(default=None)
    tipo_usuario = TextField(default=None)
    data_acesso = DateTimeField(default=datetime.datetime.now)

    def create_estrutura(self, nome, tipo_estrutura, telefone=None, vinculo_rede=None, vinculo_escola=None,
                         cep=None, endereco=None, numero=None, estado=None, uf=None, quem_criou=None, serie=None,
                         tipo_item=None, preco=None, tipo_medalha=None,
                         descricao=None, descricao_completa=None, nome_usuario=None, tipo_usuario=None):

        return self.create(nome=nome, tipo_estrutura=tipo_estrutura, telefone=telefone, vinculo_rede=vinculo_rede,
                    vinculo_escola=vinculo_escola, cep=cep, endereco=endereco, numero=numero, estado=estado, uf=uf,
                    quem_criou=quem_criou, serie=serie, tipo_item=tipo_item, preco=preco, tipo_medalha=tipo_medalha,
                    descricao=descricao, descricao_completa=descricao_completa, nome_usuario=nome_usuario,
                    tipo_usuario=tipo_usuario)

    def read_estrutura(self, tipo_estrutura):

        listas = []

        for lista in DbEstrutura.query(DbEstrutura.tipo_estrutura == tipo_estrutura, order_by=self.id):
            listas.append(dict(id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                               serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                               vinculo_rede=lista.vinculo_rede,
                               cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                               estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                               preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                               descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                               nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario,
                               data_acesso=lista.data_acesso
                               ))

        return listas

    def search_estrutura_id(self, id):

        lista = DbEstrutura.load(id)
        lista_dic = dict(id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                         serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                         vinculo_rede=lista.vinculo_rede,
                         cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                         estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                         preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                         descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                         nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario
                         )

        return lista_dic

    def search_estrutura(self, tipo_estrutura, nome):
        for lista in DbEstrutura.query(DbEstrutura.tipo_estrutura == tipo_estrutura and DbEstrutura.nome == nome):
            lista_dic = dict(id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                             serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                             vinculo_rede=lista.vinculo_rede,
                             cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                             estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                             preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                             descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                             nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario
                             )

            return lista_dic

    def ja_possui_item(self, usuario_logado):
        """
        Envia se o usuario já comprou o item
        :param usuario_logado: Id do usuario
        :return: Lista de itens que o usuario não tem
        """
        usuario = DbAluno()
        itens_usuario = [x.decode('utf-8') for x in
                         usuario.pesquisa_usuario(usuario_nome=usuario_logado).itens_comprados]
        itens = [str(y['id']) for y in self.read_estrutura(tipo_estrutura='4')]
        lista_teste = [z for z in itens if z not in itens_usuario]

        return lista_teste
    def delete_estrutura_test(self):
        pass