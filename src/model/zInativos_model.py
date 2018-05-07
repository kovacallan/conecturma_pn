from walrus import *
from model.aluno_model import *
from model.estrutura_model import *
from model.observador_model import *

# from facade.Facade_main import *
db = Database(host='localhost', port=6379, db=0)

# facade=Facade()
"""lista de informaçoes
tipos :
0-adm
1-gestor
2-diretor
3-professor
4-responsavel
5-responvadel
6-aluno
7-aluno varejo

tipo_estrutura:
1-rede
2-escola
3-turma
4-item
5-medalha

tipo_itens :
1-cores
2-rosto
3-acessorio
4-corpo"""


class DbCemiterio(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    matricula = TextField()
    nome = TextField(fts=True, index=True)
    senha = TextField()
    tipo_usuario = TextField(default='0')
    itens_comprados = ListField()
    cor = IntegerField(default=0)
    rosto = IntegerField(default=0)
    acessorio = IntegerField(default=0)
    corpo = IntegerField(default=0)
    pontos_j1 = IntegerField(default=0)
    cliques_j1 = IntegerField(default=0)
    pontos_j2 = IntegerField(default=0)
    cliques_j2 = IntegerField(default=0)
    pontos_de_vida = IntegerField(default=0)
    pontos_de_moedas = IntegerField(default=0)
    desempenho_aluno_j1 = FloatField(default=0)
    desempenho_aluno_j2 = FloatField(default=0)
    vinculo_escola = TextField(default=None, fts=True)
    anotacoes_aluno = ListField()
    vinculo_turma = TextField(fts=True, index=True, default=None)
    tipo_estrutura = TextField(fts=True, index=True)
    telefone = TextField(default=None)
    vinculo_rede = TextField(default=None)
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
    data_acesso = DateTimeField(default=datetime.datetime.now)
    anotacoes_estrutura = ListField()
    cpf = TextField(default=None)
    email = TextField(default=None)
    tipo = TextField(fts=True)
    data_ultimo_login = TextField()
    anotacoes_observador = ListField()

    aluno = DbAluno()
    observador = DbObservador()

    def desativar_atores(self, atores_id):
        # print("inativos", atores_id)
        for atores_id in atores_id:
            try:
                print("atores_id , inativos l87", atores_id)
                # if self.create( **{k: getattr(atores_id, k) for k in dir(atores_id)})
                if self.create(matricula=atores_id.matricula, nome=atores_id.nome, senha=atores_id.senha,
                               tipo_usuario=atores_id.tipo_aluno, cor=atores_id.cor,
                               rosto=atores_id.rosto, acessorio=atores_id.acessorio, corpo=atores_id.corpo,
                               pontos_j1=atores_id.pontos_j1, cliques_j1=atores_id.cliques_j1,
                               pontos_j2=atores_id.pontos_j2, cliques_j2=atores_id.cliques_j2,
                               pontos_de_vida=atores_id.pontos_de_vida, pontos_de_moedas=atores_id.pontos_de_moedas,
                               vinculo_escola=atores_id.vinculo_escola, vinculo_turma=atores_id.vinculo_turma):
                    print("sucesso em criar inativo L95 , model")
                else:
                    print("deu ruim")
            except AttributeError:
                observador = DbObservador.load(atores_id.id)
                if self.create(nome=observador.nome, senha=observador.senha, telefone=observador.telefone,
                               cpf=observador.cpf,
                               email=observador.email, tipo_usuario=observador.tipo,
                               vinculo_rede=observador.vinculo_rede,
                               vinculo_escola=observador.vinculo_escola
                        , data_ultimo_login=observador.data_ultimo_login):
                    print("sucesso em criar inativo L106 , model")
                else:
                    print("derrota")

    def complemento_create(self, ator, cemiterio_nome):
        try:
            usuario = DbAluno.load(ator.id)
        except KeyError:
            usuario = DbObservador.load(ator.id)

        inativar = self.pesquisa_inativo(cemiterio_nome)
        inativado = self.load(inativar.id)
        try:
            if usuario.anotacoes_aluno is not None:
                for x in range(0, len(usuario.anotacoes_aluno)):
                    inativado.anotacoes_aluno.append(usuario.anotacoes_aluno[x])
            else:
                pass
            if usuario.itens_comprados is not None:
                for y in range(0, len(usuario.itens_comprados)):
                    inativado.itens_comprados.append(usuario.itens_comprados[y])
            else:
                pass

            """nao esquecer de acrescentar as pontuaçoes dos jogos"""
            if inativar.matricula == usuario.matricula and inativar.nome == usuario.nome and \
                    inativar.senha == usuario.senha and inativar.tipo_usuario == usuario.tipo_aluno and \
                    inativar.cor == usuario.cor and inativar.rosto == usuario.rosto and \
                    inativar.acessorio == usuario.acessorio and inativar.corpo == usuario.corpo and \
                    inativar.pontos_de_vida == usuario.pontos_de_vida and \
                    inativar.pontos_de_moedas == usuario.pontos_de_moedas and \
                    inativar.vinculo_escola == usuario.vinculo_escola \
                    and inativar.vinculo_turma == usuario.vinculo_turma:
                inativar.save()
                usuario.delete(usuario.id)
                return True
            else:
                print("vish , n foi ")
                return False
        except AttributeError:
            print("aqui começa professor,preencher listas ")

    def fazer_os_de_cima(self, lista_inativados):
        self.desativar_atores(lista_inativados)
        # x = len(lista_inativados)
        while lista_inativados:
            x = 0
            paradas = lista_inativados[x]
            try:
                coiso = DbAluno.load(paradas.id)
            except KeyError:
                coiso = DbObservador.load(paradas.id)
            nome = coiso.nome
            self.complemento_create(paradas, nome)
            lista_inativados.pop(0)

    def pesquisa_inativo(self, nome_cem):

        usuario = []
        for pesquisa in DbCemiterio.query(DbCemiterio.nome == nome_cem):
            usuario = pesquisa
        return usuario

    def ressucitar_ususario(self, user):
        """USER SERIA EM FORMATO <Dbcemiterio: x >"""
        zumbi = user.load(user.id)
        atores_id = user.load(user.id)
        print("hmm,falsopq?",zumbi.tipo_usuario,atores_id.tipo_usuario)
        # if DbAluno.create(**{k: getattr(zumbi, k) for k in dir(zumbi)}):
        if atores_id.tipo_usuario == "6" or atores_id.tipo_usuario == "7":
            if self.aluno.restaurar_aluno(matricula=atores_id.matricula, nome=atores_id.nome, senha=atores_id.senha,
                                          tipo_aluno=atores_id.tipo_usuario, cor=atores_id.cor,
                                          rosto=atores_id.rosto, acessorio=atores_id.acessorio, corpo=atores_id.corpo,
                                          pontos_j1=atores_id.pontos_j1, cliques_j1=atores_id.cliques_j1,
                                          pontos_j2=atores_id.pontos_j2, cliques_j2=atores_id.cliques_j2,
                                          pontos_de_vida=atores_id.pontos_de_vida,
                                          pontos_de_moedas=atores_id.pontos_de_moedas,
                                          desempenho_aluno_j1=atores_id.desempenho_aluno_j1,
                                          desempenho_aluno_j2=atores_id.desempenho_aluno_j2,
                                          vinculo_escola=atores_id.vinculo_escola,
                                          vinculo_turma=atores_id.vinculo_turma):

                return True
            else:
                print("esse falso")
                return False
        else:
            print("nao , esse")
            return False

    def inativos_estrutura(self, estruturi):
        estrutura = self.load(estruturi.id)
        self.create(tipo_estrutura=estrutura.tipo_estrutura, telefone=estrutura.telefone,
                    vinculo_rede=estrutura.vinculo_rede, vinculo_escola=estrutura.vinculo_escola, cep=estrutura.cep,
                    endereco=estrutura.endereco, numero=estrutura.numero, estado=estrutura.estado, uf=estrutura.uf,
                    quem_criou=estrutura.quem_criou, serie=estrutura.serie, tipo_item=estrutura.tipo_item,
                    preco=estrutura.preco, tipo_medalha=estrutura.tipo_medalha, descriçao=estrutura.descricao,
                    descricao_completa=estrutura.descricao_completa, nome_usuario=estrutura.nome_usuario,
                    tipo_usuario=estrutura.tipo_usuario, data_acesso=estrutura.data_acesso,
                    anotacoes_estrutura=estrutura.anotacoes_estrutura)

    # def deletar_estrutura(self,estrutura_nome,tipo):
    #
    #     morto=self.pesquisa_inativo(estrutura_nome)
    #     vivo=DbEstrutura.search_estrutura()
    #     if morto.tipo_estrutura == vivo.tipo_estrutura, morto.telefone == vivo.telefone,
    #     morto.vinculo_rede == vivo.vinculo_rede, morto.vinculo_escola == vivo.vinculo_escola, morto.cep == vivo.cep,
    #     morto.endereco == vivo.endereco, morto.numero == vivo.numero, morto.estado == vivo.estado, morto.uf == vivo.uf,
    #     morto.quem_criou == vivo.quem_criou, morto.serie == estrutura.serie, tipo_item == estrutura.tipo_item,
    #     preco = estrutura.preco, tipo_medalha = estrutura.tipo_medalha, descriçao = estrutura.descricao,
    #     descricao_completa = estrutura.descricao_completa, nome_usuario = estrutura.nome_usuario,
    #     tipo_usuario = estrutura.tipo_usuario, data_acesso = estrutura.data_acesso,
    #     anotacoes_estrutura = estrutura.anotacoes_estrutura:
