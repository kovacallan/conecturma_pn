
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
    vinculo_rede = TextField(fts=True)
    cod_identificacao = TextField()
    desempenho = FloatField(default=0)

    def create_escola(self, nome, rua, numero, telefone, estado, cidade, vinculo_rede, cod_identificacao):
        """
        metodo de criar a escola
        :param nome: nome da escola
        :param rua: rua da escola
        :param numero: numero da escola
        :param telefone: telefone da escola
        :param estado: estado que esta a escola
        :param cidade: cidade que esta a escola
        :param rede_pertencente: qual a rede que pertence
        :param cod_identificacao: codigo de identificaçao da escola
        :return: true se cponseguiu criar a escola e false se nao conseguiu
        """
        if self.create(nome=nome, rua=rua, numero=numero, telefone=telefone, estado=estado, cidade=cidade,
                       vinculo_rede=vinculo_rede,
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

        for escola in self.query(order_by=DbEscola.id):
            escola_dic.append(
                dict(id=escola.id, nome=escola.nome, rua=escola.rua, cod_identificacao=escola.cod_identificacao,
                     rede=escola.vinculo_rede))

        return escola_dic

    def update_escola(self, id, nome, rua, numero, telefone, cidade, estado, rede_pertencente, cod_identificacao):
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
        if vinculo_rede == "" or nome == None:
            pass
        else:
            escola.vinculo_rede = rede_pertencente
        if cod_identificacao == "" or cod_identificacao == None:
            pass
        else:
            escola.cod_identificacao = cod_identificacao

        escola.save()

    def search_escola_id(self, id):
        search = self.load(id)
        escolas = dict(id=search.id, nome=search.nome, rua=search.rua, numero=search.numero,
                       telefone=search.telefone, estado=search.estado, cidade=search.cidade,
                       vinculo_rede=search.vinculo_rede, cod_identificacao=search.cod_identificacao)
        return escolas

    def search_escola(self, nome):
        """
        pesquisa a escola
        :param nome: nome da escola
        :return: o dicionjario com todos os dados da escola

        """

        escolas = None
        for search in DbEscola.query(DbEscola.nome == nome):
            escolas = dict(id=search.id, nome=search.nome, rua=search.rua, numero=search.numero,
                           telefone=search.telefone, estado=search.estado, cidade=search.cidade,
                           vinculo_rede=search.vinculo_rede, cod_identificacao=search.cod_identificacao,
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
