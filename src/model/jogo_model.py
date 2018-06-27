from walrus import *

db = Database(host='localhost', port=6379, db=0)

class DesempenhoJogo(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    id_aluno=TextField(fts=True, default='0')
    aventura=TextField(fts=True, default='0')
    unidade=TextField(fts=True, default='0')
    objeto_aprendizagem=TextField(fts=True, default='0')
    nivel_concluido = ListField()
    hmm={}


    def create_desempenho_jogo(self, **kwargs):
        self.create(**kwargs)

    def search_oa_concluido_id_aluno(self, id_aluno):
        conclucoes = []

        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno), order_by=DesempenhoJogo.objeto_aprendizagem):
            conclucoes.append(vars(i)["_data"])

        return conclucoes

    def unidade_concluida(self, id_aluno, unidade):
        teste = []
        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno) and
                                      (DesempenhoJogo.unidade == unidade), order_by=DesempenhoJogo.unidade):
            teste.append(vars(i)['_data'])

        return teste

