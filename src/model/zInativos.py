from walrus import *
from model.aluno_model import *
from model.estrutura_model import *
from model.observador_model import *

db = Database(host='localhost', port=6379, db=0)
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
    vinculo_escola = TextField(defauld=None, fts=True)
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

    def desativar_atores(self, atores_id):


        for atores_id in atores_id:
            self.load(atores_id)
            if not atores_id.anotaçoes_aluno:
                """observador"""
                self.create(nome=atores_id.nome, senha=atores_id.senha, telefone=atores_id.telefone, cpf=atores_id.cpf,
                            email=atores_id.email, tipo_usuario=atores_id.tipo, vinculo_rede=atores_id.vinculo_rede,
                            vinculo_escola=atores_id.vinculo_escola, data_ultimo_login=atores_id.data_ultimo_login,
                            anotacoes_observador=atores_id.anotaçoes_aluno)
            else:
                """aluno"""
                if atores_id=="1":
                    tipo="6"
                else:
                    tipo="7"
                self.create(matricula=atores_id.matricula,nome=atores_id.nome,senha=atores_id.senha,tipo_usuario=tipo,itens_comprados=atores_id.itens_comprados,cor=atores_id.cor)