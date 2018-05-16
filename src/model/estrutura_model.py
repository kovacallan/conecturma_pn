from walrus import *
from model.aluno_model import *

db = Database(host='localhost', port=6379, db=0)


class DbEstrutura(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField(index=True)
    tipo_estrutura = TextField(fts=True, index=True)
    telefone = TextField(default='0')
    vinculo_rede = TextField(fts=True, default='0')
    vinculo_escola = TextField(fts=True, default='0')
    vinculo_professor_turma = TextField(fts=True, default='0')
    cep = TextField(default='0')
    endereco = TextField(default='0')
    numero = TextField(default='0')
    estado = TextField(default='0')
    uf = TextField(default='0')
    quem_criou = TextField(default='0')
    serie = TextField(default='0')
    tipo_item = TextField(default='0')
    preco = IntegerField(default=0)
    tipo_medalha = TextField(default='0')
    descricao = TextField(default='0')
    descricao_completa = TextField(default='0')
    nome_usuario = TextField(default='0')
    tipo_usuario = TextField(default='0')
    data_acesso = DateTimeField(default=datetime.datetime.now)
    anotacoes_estrutura_baixo = ListField()
    anotacoes_estrutura_cima = ListField()


    def create_estrutura(self, nome, tipo_estrutura, telefone='0', vinculo_rede='0', vinculo_escola='0',
                         cep='0', endereco='0', numero='0', estado='0', uf='0', quem_criou='0', serie='0',
                         tipo_item='0', preco='0', tipo_medalha='0',
                         descricao='0', descricao_completa='0', nome_usuario='0', tipo_usuario='0'):

        return self.create(nome=nome, tipo_estrutura=tipo_estrutura, telefone=telefone, vinculo_rede=vinculo_rede,
                           vinculo_escola=vinculo_escola, cep=cep, endereco=endereco, numero=numero, estado=estado,
                           uf=uf,
                           quem_criou=quem_criou, serie=serie, tipo_item=tipo_item, preco=preco,
                           tipo_medalha=tipo_medalha,
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
        print("listas EM",listas)
        return listas

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

    def delete_estrutura_test(self,deletar_ids):

        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def search_estrutura(self, tipo_estrutura, nome):
        lista_dic = None
        for search in DbEstrutura.query(DbEstrutura.tipo_estrutura == tipo_estrutura and DbEstrutura.nome == nome):
            lista_dic = dict(id=search.id, nome=search.nome, criador=search.quem_criou, escola=search.vinculo_escola,
                             serie=search.serie, tipo_estrutura=search.tipo_estrutura, telefone=search.telefone,
                             vinculo_rede=search.vinculo_rede,
                             cep=search.cep, numero=search.numero,
                             estado=search.estado, uf=search.uf, tipo_item=search.tipo_item,
                             preco=search.preco, tipo_medalha=search.tipo_medalha,
                             descricao=search.descricao, descricao_completa=search.descricao_completa,
                             nome_usuario=search.nome_usuario, tipo_usuario=search.tipo_usuario)
        return lista_dic

    def search_estrutura_id(self, id):
        print("{} {}".format(id, type(id)))
        if id != 0:
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
        else:
            return dict(nome=' ', vinculo_rede=' ')

    def search_escola_by_rede(self, vinculo_rede):
        escola = []
        for search in DbEstrutura.query(DbEstrutura.vinculo_rede == vinculo_rede and DbEstrutura.tipo_estrutura == '2'):
            escola.append(
                dict(id=search.id, nome=search.nome, criador=search.quem_criou, escola=search.vinculo_escola,
                     serie=search.serie, tipo_estrutura=search.tipo_estrutura, telefone=search.telefone,
                     vinculo_rede=search.vinculo_rede,
                     cep=search.cep, endereco=search.endereco, numero=search.numero,
                     estado=search.estado, uf=search.uf, tipo_item=search.tipo_item,
                     preco=search.preco, tipo_medalha=search.tipo_medalha,
                     descricao=search.descricao, descricao_completa=search.descricao_completa,
                     nome_usuario=search.nome_usuario, tipo_usuario=search.tipo_usuario)
            )

        return escola

    def search_turma_by_rede(self, vinculo_rede):
        turma = []
        for search in DbEstrutura.query(DbEstrutura.vinculo_rede == vinculo_rede and DbEstrutura.tipo_estrutura == '3'):
            turma.append(
                dict(id=search.id, nome=search.nome, criador=search.quem_criou, escola=search.vinculo_escola,
                     serie=search.serie, tipo_estrutura=search.tipo_estrutura, telefone=search.telefone,
                     vinculo_rede=search.vinculo_rede,
                     cep=search.cep, endereco=search.endereco, numero=search.numero,
                     estado=search.estado, uf=search.uf, tipo_item=search.tipo_item,
                     preco=search.preco, tipo_medalha=search.tipo_medalha,
                     descricao=search.descricao, descricao_completa=search.descricao_completa,
                     nome_usuario=search.nome_usuario, tipo_usuario=search.tipo_usuario)
            )
        return turma

    def search_turma_by_escola(self, vinculo_escola):
        turma = []
        for search in DbEstrutura.query(
                DbEstrutura.vinculo_escola == vinculo_escola and DbEstrutura.tipo_estrutura == '3'):
            turma.append(
                dict(id=search.id, nome=search.nome, criador=search.quem_criou, escola=search.vinculo_escola,
                     serie=search.serie, tipo_estrutura=search.tipo_estrutura, telefone=search.telefone,
                     vinculo_rede=search.vinculo_rede,
                     cep=search.cep, endereco=search.endereco, numero=search.numero,
                     estado=search.estado, uf=search.uf, tipo_item=search.tipo_item,
                     preco=search.preco, tipo_medalha=search.tipo_medalha,
                     descricao=search.descricao, descricao_completa=search.descricao_completa,
                     nome_usuario=search.nome_usuario, tipo_usuario=search.tipo_usuario)
            )
            return turma

    # def ja_possui_item(self, usuario_logado):
    #     """
    #     Envia se o usuario já comprou o item
    #     :param usuario_logado: Id do usuario
    #     :return: Lista de itens que o usuario não tem
    #     """
    #     usuario = DbAluno()
    #     itens_usuario = [x.decode('utf-8') for x in
    #                      usuario.pesquisa_usuario(usuario_nome=usuario_logado).itens_comprados]
    #     itens = [str(y['id']) for y in self.read_estrutura(tipo_estrutura='4')]
    #     lista_teste = [z for z in itens if z not in itens_usuario]
    #
    #     return lista_teste

    def update_estrutura(self, update_id, nome=None, telefone=None, vinculo_rede=None, cep=None, endereco=None,
                         numero=None, cidade=None,
                         estado=None, uf=None, serie=None, tipo_item=None, preco=None, tipo_medalha=None,
                         descricao=None,
                         descricao_completa=None, nome_usuario=None, tipo_usuario=None):
        estrutura = self.load(update_id)
        [setattr(estrutura,parametro,valor) for parametro,valor in locals().items() if valor]
        estrutura.save()

    def func_anotacoes_estrutura_baixo(self,id_estrutura,mensagem):
        estrutura = self.load(id_estrutura)
        estrutura.anotacoes_estrutura_baixo.append(mensagem)
        estrutura.save()

    def func_anotacoes_estrutura_cima(self,id_estrutura,mensagem):
        estrutura=self.load(id_estrutura)
        estrutura.anotacoes_estrutura_cima.append(mensagem)
        estrutura.save()

