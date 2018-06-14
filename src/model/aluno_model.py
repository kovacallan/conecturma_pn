from walrus import *
from random import randrange

db = Database(host='localhost', port=6379, db=0)


class DbAluno(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    matricula = TextField()
    nome = TextField(fts=True, index=True)
    senha = TextField()
    email = TextField(default='0')
    tipo_aluno = TextField(default='0')

    itens_comprados = ListField()
    cor = TextField(default='0')
    rosto = TextField(default='0')
    acessorio = TextField(default='0')
    corpo = TextField(default='0')

    pontos_de_vida = IntegerField(default=0)
    pontos_de_moedas = IntegerField(default=0)

    vinculo_rede = TextField(fts=True, default='0')
    vinculo_escola = TextField(fts=True, default='0')
    vinculo_turma = TextField(fts=True, default='0')
    
    ultima_aventura = TextField(fts=True, default='0')
    ultima_unidade = TextField(fts=True, default='0')
    ultima_objeto_aprendizagem = TextField(fts=True, default='0')

    anotacoes_aluno = ListField()

    def create_aluno(self, nome, senha, matricula ,vinculo_escola='0', vinculo_rede='0'):

        self.create(nome=nome, tipo_aluno='6', vinculo_escola=vinculo_escola, senha=senha,
                    vinculo_rede=vinculo_rede, matricula=matricula)


    def update_aluno(self, update_id, nome, senha, turma, escola, rede):

        aluno_up = self.load(update_id)
        [setattr(aluno_up, parametro, valor) for parametro, valor in locals().items() if
         valor != aluno_up.all()]
        aluno_up.save()

    def read_aluno(self):
        # O administrador deveria ver tambem a senha do aluno , lembrete de modificar esse metodo
        alunos = []
        for search in self.query(order_by=self.nome):
            alunos.append(
                dict(
                    id=search.id, matricula=search.matricula, nome=search.nome, senha=search.senha,
                    tipo=search.tipo_aluno, itens_comprados=search.itens_comprados, cor=search.cor,
                    rosto=search.rosto, acessorio=search.acessorio, corpo=search.corpo,
                    pontos_de_vida=search.pontos_de_vida, pontos_de_moedas=search.pontos_de_moedas,
                    vinculo_escola=search.vinculo_escola, vinculo_rede=search.vinculo_rede,
                    vinculo_turma=search.vinculo_turma,email= search.email, cpf=''
                )
            )
        return alunos

    def search_aluno_nome(self, nome):

        alun_pes = None
        for search in DbAluno.query(DbAluno.nome == nome):
            alun_pes = dict(
                id=search.id, matricula=search.matricula, nome=search.nome, senha=search.senha,
                tipo=search.tipo_aluno, itens_comprados=search.itens_comprados, cor=search.cor,
                rosto=search.rosto, acessorio=search.acessorio, corpo=search.corpo,
                pontos_de_vida=search.pontos_de_vida, pontos_de_moedas=search.pontos_de_moedas,
                vinculo_escola=search.vinculo_escola, vinculo_rede=search.vinculo_rede,
                vinculo_turma=search.vinculo_turma, email=search.email, cpf='',
                ultima_aventura=search.ultima_aventura, ultima_unidade=search.ultima_unidade,  ultima_objeto_aprendizagem=search.ultima_objeto_aprendizagem
            )

        return alun_pes

    def search_aluno_by_rede(self, vinculo_rede):
        alunos = []
        for search in DbAluno.query((DbAluno.vinculo_rede == vinculo_rede), order_by=DbAluno.nome):
            alunos.append(
                dict(
                    id=search.id, matricula=search.matricula, nome=search.nome, senha=search.senha,
                    tipo=search.tipo_aluno, itens_comprados=search.itens_comprados, cor=search.cor,
                    rosto=search.rosto, acessorio=search.acessorio, corpo=search.corpo,
                    pontos_de_vida=search.pontos_de_vida, pontos_de_moedas=search.pontos_de_moedas,
                    vinculo_escola=search.vinculo_escola, vinculo_rede=search.vinculo_rede,
                    vinculo_turma=search.vinculo_turma, email=search.email, cpf=''
                 )
            )
        return alunos

    def search_aluno_by_escola(self, escola):
        alunos = []

        for search in DbAluno.query((DbAluno.vinculo_escola == escola), order_by=DbAluno.nome):
            alunos.append(
                dict(
                    id=search.id, matricula=search.matricula, nome=search.nome, senha=search.senha,
                    tipo=search.tipo_aluno, itens_comprados=search.itens_comprados, cor=search.cor,
                    rosto=search.rosto, acessorio=search.acessorio, corpo=search.corpo,
                    pontos_de_vida=search.pontos_de_vida, pontos_de_moedas=search.pontos_de_moedas,
                    vinculo_escola=search.vinculo_escola, vinculo_rede=search.vinculo_rede,
                    vinculo_turma=search.vinculo_turma, email=search.email, cpf=''
                 )
            )

        return alunos

    def search_aluno_by_turma(self, vinculo_turma):
        alunos = []
        for search in DbAluno.query(DbAluno.vinculo_turma == vinculo_turma, order_by=DbAluno.nome):
            alunos.append(
                dict(
                    id=search.id, matricula=search.matricula, nome=search.nome, senha=search.senha,
                    tipo=search.tipo_aluno, itens_comprados=search.itens_comprados, cor=search.cor,
                    rosto=search.rosto, acessorio=search.acessorio, corpo=search.corpo,
                    pontos_de_vida=search.pontos_de_vida, pontos_de_moedas=search.pontos_de_moedas,
                    vinculo_escola=search.vinculo_escola, vinculo_rede=search.vinculo_rede,
                    vinculo_turma=search.vinculo_turma, email=search.email, cpf=''
                )
            )
        return alunos

    def pesquisa_aluno_objeto(self, nome_aluno):

        # pesquisa aluno esta retornando o objeto em sua totalidade , NAO DELETAR ESSE METODO  , pois uso em Dbcemiterio

        aluno_pes = []
        for pesquisa in DbAluno.query(DbAluno.nome == nome_aluno):
            aluno_pes = pesquisa

        return aluno_pes

    def alunos_in_turma(self, id_aluno, vinculo_turma):

        for id_aluno in id_aluno:
            aluno = self.load(int(id_aluno))
            aluno.vinculo_turma = str(vinculo_turma)
            aluno.save()


    def comprar_item(self, id_usuario, id_item):
        from model.estrutura_model import DbEstrutura

        item = DbEstrutura()
        usuario = DbAluno.load(id_usuario)
        preco = item.search_estrutura_id(id_item)['preco']

        if usuario.pontos_de_moedas < preco:
            print("você não tem moeda")
        else:
            usuario.pontos_de_moedas -= preco
            usuario.itens_comprados.append(id_item)
            usuario.save()

    def ver_itens_comprados(self,id_usuario):
        #         id_usuario
        # id_usuario=usuario_logado()
        usuario = DbAluno.load(id_usuario)
        itens = [''.join(str(x.decode('utf-8'))) for x in usuario.itens_comprados]
        return itens

    def equipar_item(self, id_usuario, itens):

        usuario = self.load(id_usuario)
        if itens['tipo_item'] == '1':
            usuario.cor = itens['id']
        else:
            if itens['tipo_item'] == '2':
                usuario.rosto = itens['id']
            else:
                if itens['tipo_item'] == '3':
                    usuario.acessorio = itens['id']
                else:
                    if itens['tipo_item'] == '4':
                        usuario.corpo = itens['id']
        usuario.save()

    def avatar(self, id):

        aluno_av = self.load(id)
        return dict(cor=aluno_av.cor, rosto=aluno_av.rosto, acessorio=aluno_av.acessorio, corpo=aluno_av.corpo)

    def anotacoes_do_aluno(self, id_usuario, mensagem):
        aluno_anot = self.load(id_usuario)
        aluno_anot.anotacoes_aluno.append(mensagem)
        aluno_anot.save()

    def ver_anotacoes_aluno(self, id_aluno):
        aluno_re_anot = self.load(id_aluno)

        anotacoes = []
        for x in aluno_re_anot.anotacoes_aluno:
            anotacoes.append(x.decode('utf-8'))

        return anotacoes

    def aluno_delete(self, deletar_ids):

        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def apagartudo(self):
        db.flushall()
