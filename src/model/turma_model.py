from walrus import *
import model.aluno_model


db = Database(host='localhost', port=6379, db=0)

class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)
    quem_criou = TextField()
    professores = ListField()
    desempenho_j1 = FloatField(default=0)
    desempenho_j2 = FloatField(default=0)

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
            return TypeError("Não foi possivel salvar a turma")

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

    def delete_turma(self, deletar_ids):
        """
        Deleta as turmas por id , por enquanto nao implementado

        :param id: O id da turma
        :return: None
        """
        for deletar_ids in deletar_ids:
            turma = self.load(deletar_ids)
            turma.delete(deletar_ids)

    def pesquisa_turma(self, turma_nome):
        """
        Ainda nao implementado
        :return:
        """

        for turma in DbTurma.query(DbTurma.turma_nome == turma_nome, order_by=DbTurma.id):
            turma_dic = dict(id=turma.id, nome=turma.turma_nome, criador=turma.quem_criou, desempenho_j1=turma.desempenho_j1,
                     desempenho_j2=turma.desempenho_j2)
        return turma_dic

    def turma_update(self,id, turma_nome, professor_encarregado):
        turma=self.load(id)
        if turma_nome == "" or turma_nome == None or turma.turma_nome ==turma_nome:
            pass
        else:
            turma.turma_nome = turma_nome
        if professor_encarregado == "" or professor_encarregado == None or turma.professor_encarregado == professor_encarregado:
            pass
        else:
            turma.professor_encarregado = professor_encarregado
        turma.save()


    def calcular_desempenho_jogos(self):
        soma = 0
        soma2 = 0
        x = 0
        y = 0
        for model.aluno_model.DbAluno.id in DbTurma:
            retorno = self.pesquisa_turma(model.aluno_model.DbAluno.id)
            usuario = self.load(retorno)
            soma += usuario.desempenho_j1
            soma2 += usuario.desempenho_j2
            x += 1
            y += 1
        return soma / x, soma2 / y

    def vincular_professores_turma(self, id, nome, email):
        professor = dict(professor_nome = nome, professor_email = email)
        turma = self.load(id)
        turma.professores.append(professor)
        turma.save()

    def mostrar_professores_turma(self, id):
        turma = self.load(id)



