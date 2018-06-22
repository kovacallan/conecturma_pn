from walrus import *

class OaConcluido():
    id = AutoIncrementField(primary_key=True)
    id_aluno = TextField(fts=True, default='0')
    id_oa = TextField(fts=True, default='0')
    nivel_concluido = ListField(default=['0'])

    def create_oa_concluido(self, **kwargs):
        self.create(**kwargs)

    def search_oa_concluido_id_aluno(self, id_aluno):
        conclucoes = []

        for i in OaConcluido.query((OaConcluido.id_aluno==id_aluno), order_by=OaConcluido.id_oa):
            conclucoes.append(vars(i)["_data"])

        return conclucoes