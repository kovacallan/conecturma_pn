from model.estrutura_model import DbEstrutura
# turma =DbEstrutura()

estrutura='3'
class TurmaFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.turma = DbEstrutura()



    def create_turma_facade(self, nome, login, serie, escola):
        """
        Cria uma turma no banco de dados
        :param nome: Nome da turma
        :param login: Nome do criador da turma
        :return: None
        """
        return self.turma.create_estrutura(nome=nome, tipo_estrutura=estrutura, quem_criou=login, serie=serie, vinculo_escola=escola)

    def read_turma_facade(self):
        """
        Mostra as turmas criadas
        :return:Um dicionario com os valores:id , nome da turma , criador , desempenho j1 e desempenho j2 da turma
        """
        return self.turma.read_estrutura(tipo_estrutura=estrutura)

    def delete_turma_facade_test(self, deletar_ids):
        return self.turma.delete_estrutura_test(deletar_ids)

    def search_turma_facade(self, turma_nome):
        return self.turma.search_estrutura(tipo_estrutura=estrutura, nome=turma_nome)

    def vincular_professor_turma_facade(self,prof_id , turma_id):
        return self.turma.vincular_prof_turma(prof_id, turma_id, tipo_estrutura=estrutura)

    def apagartudo(self):
        return self.turma.darflush()
