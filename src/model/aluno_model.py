from walrus import *
from random import randrange
from src.model.estrutura_model import *

db = Database(host='localhost', port=6379, db=0)


class DbAluno(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    matricula = TextField()
    nome = TextField(fts=True, index=True)
    senha = TextField()
    tipo_aluno = TextField(default='0')
    itens_comprados = ListField()
    cor = TextField(default='0')
    rosto = TextField(default='0')
    acessorio = TextField(default='0')
    corpo = TextField(default='0')
    pontos_j1 = IntegerField(default=0)
    cliques_j1 = IntegerField(default=0)
    pontos_j2 = IntegerField(default=0)
    cliques_j2 = IntegerField(default=0)
    pontos_de_vida = IntegerField(default=0)
    pontos_de_moedas = IntegerField(default=0)
    desempenho_aluno_j1 = FloatField(default=0)
    desempenho_aluno_j2 = FloatField(default=0)
    vinculo_rede = TextField(fts=True, default='0')
    vinculo_escola = TextField(fts=True, default='0')
    anotacoes_aluno = ListField()
    vinculo_turma = TextField(fts=True, index=True, default='0')

    def aluno_logado(self, id_usuario):

        usuario = self.load(id_usuario)
        return usuario

    def gerar_matricula(self):

        matricula = []
        for i in range(0, 5):
            matricula.append(randrange(1, 9))
        matricula = ''.join(str(x) for x in matricula)
        return matricula

    def validar_senha_vazia(self, senha):

        if senha == "" or senha == None:
            return True
        else:
            return False

    def create_aluno(self, nome, senha, vinculo_escola='0', vinculo_rede='0'):

        if not self.validar_senha_vazia(senha):
            matricula = self.gerar_matricula()
            self.create(nome=nome, tipo_aluno='6', vinculo_escola=vinculo_escola, senha=senha,
                        vinculo_rede=vinculo_rede, matricula=matricula)
            return True
        else:
            return TypeError("Não foi possivel salvar o Usuário")

    def update_aluno(self, update_id, nome, senha, turma, escola, rede):

        # pode ser aprimorado , no formato(exemplo de estrutura model(parte de update))
        #         aluno = self.load(update_id)
        #         [setattr(aluno,parametro,valor) for parametro,valor in locals().items() if valor]
        #         aluno.save()
        # testar depois , para otimizaçao do codigo
        aluno_up = self.load(update_id)
        [setattr(aluno_up, parametro, valor) for parametro, valor in locals().items() if
         valor != aluno_up.parametro]
        aluno_up.save()

    def read_aluno(self):
        # O administrador deveria ver tambem a senha do aluno , lembrete de modificar esse metodo
        alunos = []
        for aluno in self.query(order_by=self.nome):
            alunos.append(dict(id=aluno.id, matricula=aluno.matricula, tipo=aluno.tipo_aluno, cpf=None, nome=aluno.nome,
                               vinculo_rede=aluno.vinculo_rede, vinculo_escola=aluno.vinculo_escola,
                               vinculo_turma=aluno.vinculo_turma))
        return alunos

    def pesquisa_aluno_nome(self, nome):

        alun_pes = None
        for search in DbAluno.query(DbAluno.nome == nome):
            alun_pes = dict(id=search.id, matricula=search.matricula, nome=search.nome, senha=search.senha,
                              tipo_aluno=search.tipo_aluno, itens_comprados=search.itens_comprados, cor=search.cor,
                              rosto=search.rosto, acessorio=search.acessorio, corpo=search.corpo,
                              pontos_j1=search.pontos_j1, cliques_j1=search.cliques_j1, pontos_j2=search.pontos_j2,
                              cliques_j2=search.cliques_j2, pontos_de_vida=search.pontos_de_vida,
                              pontos_de_moedas=search.pontos_de_moedas, desempenho_aluno_j1=search.desempenho_aluno_j1,
                              desempenho_aluno_j2=search.desempenho_aluno_j2,
                              vinculo_escola=search.vinculo_escola, vinculo_rede=search.vinculo_rede,
                              vinculo_turma=search.vinculo_turma)

        return alun_pes

    def pesquisa_aluno_objeto(self, nome_aluno):

        # pesquisa aluno esta retornando o objeto em sua totalidade , NAO DELETAR ESSE METODO  , pois uso em Dbcemiterio

        aluno_pes = []
        for pesquisa in DbAluno.query(DbAluno.nome == nome_aluno):
            aluno_pes = pesquisa

        return aluno_pes

    def pontos_jogo(self, usuario, jogo, pontos):

        retorno = self.pesquisa_aluno_nome(usuario)

        if pontos == None:
            return False
        elif jogo == 'j1':
            if self.jogo_j1(retorno['id'], pontos):
                return True
            else:
                return False
        elif jogo == 'j2':
            if self.jogo_j2(retorno['id'], pontos):
                return True
            else:
                return False

    def jogo_j1(self, id, pontos):

        usuario = self.load(id)
        usuario.pontos_j1 += pontos
        usuario.cliques_j1 += 1
        self.desempenho_jogoj1(usuario)
        if usuario.pontos_j1 % 3 == 0 and pontos == 1:
            self.mais_vidas(usuario)
        if usuario.pontos_j1 % 5 == 0 and pontos == 1:
            self.mais_dinheiro(usuario)
        usuario.save()
        return True

    def jogo_j2(self, id, pontos):

        usuario = self.load(id)
        usuario.pontos_j2 += pontos
        usuario.cliques_j2 += 1
        self.desempenho_jogoj2(usuario)
        if usuario.pontos_j2 % 3 == 0 and pontos == 1:
            usuario.mais_vidas(usuario)

        if usuario.pontos_j2 % 5 == 0 and pontos == 1:
            usuario.mais_dinheiro(usuario)
        usuario.save()
        return True

    def desempenho_jogoj1(self, usuario):

        usuario.desempenho_aluno_j1 = (usuario.pontos_j1 / usuario.cliques_j1) * 100

    def desempenho_jogoj2(self, usuario):

        usuario.desempenho_aluno_j2 = (usuario.pontos_j2 / usuario.cliques_j2) * 100

    def alunos_in_turma(self, id_aluno, vinculo_turma):
        try:
            for id_aluno in id_aluno:
                aluno = self.load(id_aluno.id)
                aluno.vinculo_turma = str(vinculo_turma['id'])
                aluno.save()
        except ValueError:
            print('Erro!')

    def comprar_item(self, id_usuario, id_item):

        item = DbEstrutura()
        usuario = DbAluno.load(id_usuario)
        preco = item.search_estrutura_id(id_item)['preco']

        if usuario.pontos_de_moedas < preco:
            print("você não tem moeda")
        else:
            usuario.pontos_de_moedas -= preco
            usuario.itens_comprados.append(id_item)
            usuario.save()

    def ver_itens_comprados(self, id_usuario):

        usuario = self.load(id_usuario)
        itens = [int(''.join(str(x.decode('utf-8')))) for x in usuario.itens_comprados]
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

        aluno_av = self.aluno_logado(id)
        return dict(cor=aluno_av.cor, rosto=aluno_av.rosto, acessorio=aluno_av.acessorio, corpo=aluno_av.corpo)

    def definir_nova_senha(self, usuario_id, senha_antiga, senha_nova):

        Aluno_sen = self.load(usuario_id)
        if senha_antiga == Aluno_sen.senha:
            Aluno_sen.senha = senha_nova
            Aluno_sen.save()
        else:
            print("senha antiga errada")

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

    def search_aluno_by_escola(self, escola):
        alunos = []
        escola_estrutura = DbEstrutura()
        for aluno in DbAluno.query(DbAluno.vinculo_escola == escola, order_by=DbAluno.nome):
            vinculo_escola = escola_estrutura.search_estrutura_id(int(aluno.vinculo_escola))
            alunos.append(dict(id=aluno.id, matricula=aluno.matricula, tipo=aluno.tipo_aluno, cpf=None, nome=aluno.nome,
                               vinculo_rede="", vinculo_escola=vinculo_escola['nome'],
                               vinculo_turma=aluno.vinculo_turma))
        return alunos

    def search_aluno_by_turma(self, vinculo_turma):
        alunos = []
        for aluno in DbAluno.query(DbAluno.vinculo_turma == vinculo_turma, order_by=DbAluno.nome):
            alunos.append(dict(id=aluno.id, matricula=aluno.matricula, tipo=aluno.tipo_aluno, cpf="", nome=aluno.nome,
                               vinculo_rede="", vinculo_escola=aluno.vinculo_escola,
                               vinculo_turma=aluno.vinculo_turma))
        return alunos

    def aluno_delete(self, deletar_ids):

        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def apagartudo(self):
        db.flushall()
