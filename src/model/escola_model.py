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
    rua = TextField()
    numero = IntegerField(default=0)
    telefone = TextField()
    estado = TextField()
    cidade = TextField()
    rede_pertencente = TextField()
    cod_identificacao = TextField()
    desempenho = FloatField(default=0)

    def create_escola(self, nome, rua, numero, telefone, estado, cidade, rede_pertencente, cod_identificacao):
        if self.create(nome=nome, rua=rua, numero=numero, telefone=telefone, estado=estado, cidade=cidade,
                       rede_pertencente=rede_pertencente,
                       cod_identificaçao=cod_identificacao):
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
                dict(id=escola.id, nome=escola.nome, rua=escola.rua, numero=escola.numero, telefone=escola.telefone,
                     estado=escola.estado, cidade=escola.cidade))
        return escola_dic

    def update_escola(self, id, nome, rua, numero, telefone,cidade,estado,rede_pertencente, cod_identificacao):
        """
        muda os atributos da escola pelo id
        :param id: id da escola que vai ter as mudanças
        :param nome:novo nome da escola
        :param rua:nova rua da escola
        :param numero:novo numero da escola
        :param telefone:novo telefone da escola
        :param rede_pertencente:nova rede a qual pertence a escola
        :param cod_identificacao:novo codigo de identificaçao da escola
        :return:None
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

    def search_escola(self, nome):

        escolas = None
        for search in DbEscola.query(DbEscola.nome == nome):
            escolas = dict(id=search.id, nome=search.nome, rua=search.rua, numero=search.numero,
                           telefone=search.telefone, estado=search.estado, cidade=search.cidade,
                           rede_pertencente=search.rede_pertencente, cod_identificacao=search.cod_identificacao,
                           desempenho=search.desempenho)
        return escolas

    def delete_escola(self, deletar_ids):
        """
        Deleta a lista de ids selecionados
        :param deletar_ids: lista de ids a serem deletados
        :return: None
        """
        for deletar_ids in deletar_ids:
            escola = self.load(deletar_ids)
            escola.delete(deletar_ids)
