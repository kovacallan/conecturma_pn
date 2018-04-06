from src.model.turma_model import DbTurma

class TurmaFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.turma = DbTurma()



    def create_turma_facade(self, nome, login, serie, escola):
        """
        Cria uma turma no banco de dados
        :param nome: Nome da turma
        :param login: Nome do criador da turma
        :return: None
        """
        return self.turma.create_turma(turma=nome, login=login, serie=serie, escola=escola)

    def read_turma_facade(self):
        """
        Mostra as turmas criadas
        :return:Um dicionario com os valores:id , nome da turma , criador , desempenho j1 e desempenho j2 da turma
        """
        return self.turma.read_turma()

    def delete_turma_facade(self, id):
        """
        Deleta uma turma pelo id
        :param id:id da turma
        :return:None
        """
        self.turma.delete_turma(id)

    def search_turma_facade(self, turma_nome):
        return self.turma.search_turma(turma_nome)

    def vincular_professor_turma_facade(self, id, professor_id):
        self.turma.vincular_professores_turma(id=id, professor_id=professor_id)

    def ver_professor_turma_facade(self, id):
        return self.turma.ver_professores_turma(id=id)

