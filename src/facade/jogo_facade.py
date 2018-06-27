from model.jogo_model import DesempenhoJogo

class OaConcluidoFacade:
    def __init__(self):
        self.oaconcluido = DesempenhoJogo()

    def create_oa_concluido_facade(self, **kwargs):
        self.oaconcluido.create_desempenho_jogo(**kwargs)

    def search_oa_concluido_id_aluno_facade(self, id_aluno):
        return self.oaconcluido.search_oa_concluido_id_aluno(id_aluno)

    def unidade_concluida_facade(self, id_aluno, unidade):
        return self.oaconcluido.unidade_concluida(id_aluno=id_aluno, unidade=unidade)

