from walrus import *
from random import randrange
from src.model.loja_model import *
from src.model.turma_model import *

db = Database(host='localhost', port=6379, db=0)

"""A classe DbAluno será usada como Usuário genérico no spike que é , por enquanto, um aluno onipotente"""


class DbEscola(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True, index=True)
    rua = TextField(fts=true, index=True)
    numero = IntegerField(default=0)
    telefone = TextField()
    estado = TextField()
    cidade = TextField()
    rede_pertencente = TextField()
    cod_identificacao = TextField()
    desempenho = FloatField()

    def create_escola(self, nome, rua, numero, telefone, estado, cidade, cod_identificacao):
        """
        Cria uma turma e armazena no banco de dados ,com o dado de quem criou a turma

        :param turma: O numero , ou o nome da turma
        :param login: O nome do login de quem criou a turma
        :return: Acrescenta a turma criada ao banco de dados
        """
        if self.create(nome=nome, rua=rua, numero=numero, telefone=telefone, estado=estado, cidade=cidade,
                       cod=cod_identificacao):
            return True
        else:
            return TypeError("Não foi possivel salvar a escola")

    def read_escola(self):
        """
        Cria um dicionario vazio e acrescenta os valores de cada escola armazenada

        :return: O dicionario preenchido com as escola
        """

        escola_dic = []

        for escola in self.query(order_by=self.id):
            escola_dic.append(
                dict(id=escola.id, nome=escola.turma_nome, rua=escola.rua, numero=escola.rua, telefone=escola.telefone,
                     estado=escola.estado, cidade=escola.cidade))
        return escola_dic

    def update_escola(self, id, nome,rua,numero,telefone,rede_pertencente, cod_identificacao):
        """
        muda os atributos da escola pelo id
        :param id: id da escola que vai ter as mudanças
        :param nome:
        :param rua:
        :param numero:
        :param telefone:
        :param rede_pertencente:
        :param cod_identificacao:
        :return:
        """
        escola = self.load(id)
        if nome == "" or nome == None:
            pass
        else:
            escola.nome = nome

        if rua == "" or rua == None:
            pass
        else:
            escola.rua = rua

        if numero == "" or numero == None:
            pass
        else:
            escola.numero = numero

        if telefone == "" or telefone == None:
            pass
        else:
            escola.telefone = telefone

        if rede_pertencente == "" or nome == None:
            pass
        else:
            escola.rede_pertencente = rede_pertencente
        if cod_identificacao == "" or cod_identificacao == None:
            pass
        else:
            escola.cod_identificacao = cod_identificacao

        escola.save()
