from walrus import *


from model.aluno_model import *

db = Database(host='localhost', port=6379, db=0)

class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)
    quem_criou = TextField()
    desempenho_j1 = FloatField(default=0)
    desempenho_j2 = FloatField(default=0)
    professor_encarregado = TextField()

    def create_turma(self, turma, login):
        """
        Cria uma turma e armazena no banco de dados ,com o dado de quem criou a turma

        :param turma: O numero , ou o nome da turma
        :param login: O nome do login de quem criou a turma
        :return: Acrescenta a turma criada ao banco de dados
        """
        if self.create(turma_nome=turma, quem_criou=login):
            return True
        else:
            return TypeError("Não foi possivel salvar o Aluno")

    def read_turma(self):
        """
        Cria um dicionario vazio e acrescenta os valores de cada turma armazenada

        :return: O dicionario preenchido com as turmas
        """

        turma_dic = []

        for turma in self.query(order_by=self.id):
            turma_dic.append(
                dict(id=turma.id, nome=turma.turma_nome, criador=turma.quem_criou, desempenho_j1=turma.desempenho_j1,
                     desempenho_j2=turma.desempenho_j2))

        return turma_dic

    def delete_turma(self, id):
        """
        Deleta as turmas por id , por enquanto nao implementado

        :param id: O id da turma
        :return: None
        """
        turma = DbTurma(id=id)
        turma.delete()

    def pesquisa_turma(self, turma_nome):
        """
        Ainda nao implementado
        :return:
        """
        turma = {}
        for pesquisa in DbTurma.query(DbTurma.turma_nome == turma_nome, order_by=DbTurma.id):
            turma = pesquisa

        if turma == '' and turma is None:
            return False
        else:
            return turma

    def turma_in(self):
        pass

    def calcular_desempenho_jogos(self):
        soma = 0
        soma2 = 0
        x = 0
        y = 0
        for DbAluno.id in DbTurma:
            retorno = self.pesquisa_turma(DbAluno.id)
            usuario = self.load(retorno)
            soma += usuario.desempenho_j1
            soma2 += usuario.desempenho_j2
            x += 1
            y += 1
        return soma / x, soma2 / y
