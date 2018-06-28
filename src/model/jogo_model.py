from walrus import *

db = Database(host='localhost', port=6379, db=0)

class DesempenhoJogo(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    id_aluno=TextField(fts=True)
    unidade=TextField(fts=True, default='0')
    objeto_aprendizagem=TextField(fts=True, default='0')
    jogo_jogado = ListField()


    def create_desempenho_jogo(self, **kwargs):
        self.create(**kwargs)

    def search_desempenho_id(self,id_obj):
        obj = []
        for search in DesempenhoJogo.query(DesempenhoJogo.id == id_obj):
            obj = vars(search)["_data"]
        return obj

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
        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno) & (DesempenhoJogo.objeto_aprendizagem == oa),
                                      order_by=DesempenhoJogo.id):
            conclucoes.append(vars(i)["_data"])

        return conclucoes

    def search_desempenho_concluido_id_aluno_obj_aprendizagerm(self, id_aluno,objeto_aprendizagem):
        conclucoes = []

        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno) and (DesempenhoJogo.objeto_aprendizagem==objeto_aprendizagem),
                                      order_by=DesempenhoJogo.objeto_aprendizagem):
            conclucoes.append(vars(i)["_data"])

        return conclucoes

    def armazenando_dados_jogo(self,id_obj, lista_dados_jogo):

        jogo=self.search_desempenho_id(id_obj)
        print('alun',jogo)
        print('jgo mdel ,ddos',lista_dados_jogo)
        desempenho=self.load(jogo['id'])
        desempenho.jogo_jogado.append(lista_dados_jogo)
        desempenho.save()
        print(desempenho.jogo_jogado[0])

    # def pegar_dados_jogo(self,parada,OA,aluno_id):
    #     indices=[letter for letter in OA]
    #     x=0
    #     print('indices',indices)
    #     indice_oa = [indices[x-4],indices[x-3],indices[x-2],indices[x-1]]
    #     indice_ud = [indices[x-7],indices[x-6],indices[x-5]]
    #     aventura = [indices[x-10]]
    #     oa=''.join(indice_oa)
    #     UD=''.join(indice_ud)
    #     print('Ud,oa,parada[0],aventura',UD,oa,parada[0],aventura,aluno_id)
    #     aluno=self.load(aluno_id)
    #     # print('teste',aluno)
    #     # exec(f'{y} = [] \n'
    #     #      f'print({y})\n'
    #     #      f'aluno.dados_aventura_1[z]={{{y}.append(parada)}}')
    #     # if
    #     aluno.dados_aventura_1[UD]={oa :parada}
    #     print('ud,oa',UD,oa)
    #     # aluno.dados_aventura_1[z]={exec(f'{y}').append(parada)}
    #     # if aluno.dados_aventura_1[z.encode]=={y:parada[0]}:
    #     #     pass
    #     aluno.save()
    #     print('aluno_tudo',aluno.dados_aventura_1)
    #     print('aluno_1',aluno.dados_aventura_1[UD.encode('utf-8')])
    #     print('teste',parada,
    #           parada[0],
    #           parada[1],
    #           parada[0]['nivel'],
    #           parada[0]['percentualConcluido'],
    #           parada[0]['termino'],OA)
    #
    # def mostrar_desempenho_aluno_AO(self,id_aluno,oa):
    #     objeto_aprendizagem_all=[letter for letter in oa]
    #     # oa=
    #     # ud=
    #     # av=