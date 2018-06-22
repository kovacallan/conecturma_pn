from model.jogo_model import OaConcluido

class OaConcluidoFacade:
    def __init__(self):
        self.oaconcluido = OaConcluido()

    def create_oa_concluido_facade(self, **kwargs):
        self.oaconcluido.create_oa_concluido(**kwargs)

    def search_oa_concluido_id_aluno_facade(self, id_aluno):
        return self.oaconcluido.search_oa_concluido_id_aluno(id_aluno)