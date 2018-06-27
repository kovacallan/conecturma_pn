from walrus import *

db = Database(host='localhost', port=6379, db=0)

class DesempenhoJogo(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    id_aluno=TextField(fts=True, default='0')
    unidade=TextField(fts=True, default='0')
    objeto_aprendizagem=TextField(fts=True, default='0')
    nivel_concluido = ListField()
    hmm={}


    def create_desempenho_jogo(self, **kwargs):
        self.create(**kwargs)

    def search_desempenho_concluido_id_aluno(self, id_aluno):
        conclucoes = []

        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno), order_by=DesempenhoJogo.objeto_aprendizagem):

            conclucoes.append(vars(i)["_data"])

        return conclucoes

    def unidade_teste(self, id_aluno, unidade):
        conclucoes = []
        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno) and (DesempenhoJogo.unidade == unidade),
                                      order_by=DesempenhoJogo.objeto_aprendizagem):

            conclucoes.append(vars(i)["_data"])

        return conclucoes

    def oa_teste(self, id_aluno, oa):
        conclucoes = []
        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno) and (DesempenhoJogo.objeto_aprendizagem == oa),
                                      order_by=DesempenhoJogo.objeto_aprendizagem):
            conclucoes.append(vars(i)["_data"])

        return conclucoes

