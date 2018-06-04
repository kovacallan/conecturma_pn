from walrus import *
from control.dicionarios import TIPO_ESTRUTURA
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

    unidade=TextField(default='0')
    objetivo=TextField(default='0')
    codigo=TextField(default='0')
    descritor=TextField(default='0')

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

    anotacoes_observador_turma = ListField()
    anotacoes_observador_escola = ListField()
    anotacoes_observador_rede = ListField()


    def create_estrutura(self, nome, tipo_estrutura, telefone='0', vinculo_rede='0', vinculo_escola='0',
                         cep='0', endereco='0', numero='0', estado='0', uf='0', quem_criou='0', serie='0',
                         tipo_item='0', preco='0', tipo_medalha='0',unidade='0',objeto_aprendizagem='0',
                         objetivo='0', codigo='0', descritor='0', descricao='0', descricao_completa='0',
                         nome_usuario='0', tipo_usuario='0'):

        return self.create(nome=nome, tipo_estrutura=tipo_estrutura, telefone=telefone, vinculo_rede=vinculo_rede,
                           vinculo_escola=vinculo_escola, cep=cep, endereco=endereco, numero=numero, estado=estado,
                           uf=uf, quem_criou=quem_criou, serie=serie, tipo_item=tipo_item, preco=preco,
                           tipo_medalha=tipo_medalha,unidade=unidade,objeto_aprendizagem=objeto_aprendizagem,
                           objetivo=objetivo, codigo=codigo,descritor=descritor,descricao=descricao,
                           descricao_completa=descricao_completa,nome_usuario=nome_usuario, tipo_usuario=tipo_usuario)

    def read_estrutura(self, tipo_estrutura):

        listas = []

        for lista in DbEstrutura.query(DbEstrutura.tipo_estrutura == tipo_estrutura, order_by=self.id):
            listas.append(
                dict(
                    id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                    serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                    vinculo_rede=lista.vinculo_rede,
                    cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                    estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                    preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                    descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                    nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario,
                    data_acesso=lista.data_acesso
                )
            )

        return listas

    def ja_possui_item(self, usuario_logado):
        """
        Envia se o usuario já comprou o item
        :param usuario_logado: Id do usuario
        :return: Lista de itens que o usuario não tem
        """
        from model.aluno_model import DbAluno
        usuario = DbAluno()
        #[x.decode('utf-8') for x in usuario.i]
        itens_usuario = usuario.ver_itens_comprados(id_usuario=int(usuario_logado))
        itens = [str(y['id']) for y in self.read_estrutura(tipo_estrutura=TIPO_ESTRUTURA['item'])]
        lista_teste = [z for z in itens if z not in itens_usuario]
        return lista_teste




    def search_estrutura(self, tipo_estrutura, nome):
        lista_dic = None
        for lista in DbEstrutura.query((DbEstrutura.tipo_estrutura == tipo_estrutura) and (DbEstrutura.nome == nome)):
            lista_dic = dict(
                id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                vinculo_rede=lista.vinculo_rede,
                cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario,
                data_acesso=lista.data_acesso
            )
        return lista_dic

    def search_estrutura_id(self, id):
        if id != '0':
            lista = DbEstrutura.load(int(id))
            lista_dic = dict(
                            id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                            serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                            vinculo_rede=lista.vinculo_rede,
                            cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                            estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                            preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                            descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                            nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario,
                            data_acesso=lista.data_acesso
                             )
        else:
            lista_dic = dict(
                nome=" "
            )

        return lista_dic

    def search_escola_by_rede(self, vinculo_rede):
        escola = []
        for lista in DbEstrutura.query((DbEstrutura.tipo_estrutura == '2') and (DbEstrutura.vinculo_rede == vinculo_rede),
                                       order_by=self.nome):
            escola.append(
                dict(
                    id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                    serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                    vinculo_rede=lista.vinculo_rede,
                    cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                    estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                    preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                    descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                    nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario,
                    data_acesso=lista.data_acesso
                )
            )

        return escola

    def search_turma_by_rede(self, vinculo_rede):
        turma = []
        for lista in self.query((DbEstrutura.tipo_estrutura == '3') and (DbEstrutura.vinculo_rede == vinculo_rede),
                                order_by=DbEstrutura.nome):
            turma.append(
                dict(
                    id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                    serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                    vinculo_rede=lista.vinculo_rede, cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                    estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item, preco=lista.preco,
                    tipo_medalha=lista.tipo_medalha, descricao=lista.descricao,
                    descricao_completa=lista.descricao_completa, nome_usuario=lista.nome_usuario,
                    tipo_usuario=lista.tipo_usuario, data_acesso=lista.data_acesso
                )
            )
        return turma

    def search_turma_by_escola(self, vinculo_escola):
        turma = []
        for lista in self.query((DbEstrutura.tipo_estrutura == '3') and (DbEstrutura.vinculo_escola == vinculo_escola),
                                order_by=DbEstrutura.nome):
            turma.append(
                dict(
                    id=lista.id, nome=lista.nome, criador=lista.quem_criou, escola=lista.vinculo_escola,
                    serie=lista.serie, tipo_estrutura=lista.tipo_estrutura, telefone=lista.telefone,
                    vinculo_rede=lista.vinculo_rede,
                    cep=lista.cep, endereco=lista.endereco, numero=lista.numero,
                    estado=lista.estado, uf=lista.uf, tipo_item=lista.tipo_item,
                    preco=lista.preco, tipo_medalha=lista.tipo_medalha,
                    descricao=lista.descricao, descricao_completa=lista.descricao_completa,
                    nome_usuario=lista.nome_usuario, tipo_usuario=lista.tipo_usuario,
                    data_acesso=lista.data_acesso
                )
            )
            return turma

    def update_estrutura(self, update_id, nome=None, telefone=None, vinculo_rede=None, cep=None, endereco=None,
                         numero=None, cidade=None,
                         estado=None, uf=None, serie=None, tipo_item=None, preco=None, tipo_medalha=None,
                         descricao=None,
                         descricao_completa=None, nome_usuario=None, tipo_usuario=None,vinculo_escola=None):
        estrutura = self.load(update_id)
        [setattr(estrutura,parametro,valor) for parametro,valor in locals().items() if valor]
        estrutura.save()

    def func_anotacoes_estrutura_turma(self,id_estrutura,mensagem):
        estrutura = self.load(id_estrutura)
        estrutura.anotacoes_estrutura_turma.append(mensagem)
        estrutura.save()

    def func_anotacoes_estrutura_escola(self,id_estrutura,mensagem):
        estrutura=self.load(id_estrutura)
        estrutura.anotacoes_estrutura_escola.append(mensagem)
        estrutura.save()

    def func_anotacoes_estrutura_rede(self,id_estrutura,mensagem):
        estrutura=self.load(id_estrutura)
        estrutura.anotacoes_estrutura_rede.append(mensagem)
        estrutura.save()

    # def delete_estrutura_test(self, deletar_ids):
    #
    #     for deletar_ids in deletar_ids:
    #         usuario = self.load(deletar_ids)
    #         usuario.delete(deletar_ids)
