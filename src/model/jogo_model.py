from walrus import *

db = Database(host='localhost', port=6379, db=0)

class DesempenhoJogo(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    id_aluno=TextField(fts=True)
    unidade=TextField(fts=True, default='0')
    objeto_aprendizagem=TextField(fts=True, default='0')
    jogo_jogado = ListField()



    def create_desempenho_jogo(self, *args,**kwargs):
        self.create(*args,**kwargs)

    def search_desempenho_concluido_id_aluno(self, id_aluno):
        obj = []
        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno),order_by=DesempenhoJogo.objeto_aprendizagem):
            obj.append(dict(id=i.id, id_aluno=i.id_aluno,unidade=i.unidade,objeto_aprendizagem=i.objeto_aprendizagem,
                                   jogo_jogado=[y.decode('utf-8') for y in i.jogo_jogado]
                            )
                       )
        return obj

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

            conclucoes.append(dict(id=i.id, id_aluno=i.id_aluno,unidade=i.unidade,objeto_aprendizagem=i.objeto_aprendizagem,
                                   jogo_jogado=[y.decode('utf-8') for y in i.jogo_jogado]
                            ))
        return conclucoes

    def search_oa(self,id_aluno,oa):
        oa_buscado = None
        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno==id_aluno) & (DesempenhoJogo.objeto_aprendizagem == oa),
                order_by=DesempenhoJogo.id):

            oa_buscado = dict(id=i.id, id_aluno=i.id_aluno,unidade=i.unidade,objeto_aprendizagem=i.objeto_aprendizagem,
                                   jogo_jogado=[y.decode('utf-8') for y in i.jogo_jogado])

        return oa_buscado

    def search_desempenho_concluido_id_aluno_obj_aprendizagerm(self, id_aluno,objeto_aprendizagem):
        conclucoes = []

        for i in DesempenhoJogo.query((DesempenhoJogo.id_aluno == id_aluno) and (DesempenhoJogo.objeto_aprendizagem==objeto_aprendizagem),
                                      order_by=DesempenhoJogo.objeto_aprendizagem):
            conclucoes.append(vars(i)["_data"])

        return conclucoes

    def armazenando_dados_jogo(self,id_obj, lista_dados_jogo):
        desempenho=self.load(id_obj)
        desempenho.jogo_jogado.append(lista_dados_jogo)
        desempenho.save()

    def pegar_dados_jogo(self,parada,OA,aluno_id):
        indices=[letter for letter in OA]
        x=0
        print('indices',indices)
        indice_oa = [indices[9:13]]
        indice_ud = [indices[0:9]]
        # aventura = [indices[x-10]]
        oa=''.join(indice_oa)
        UD=''.join(indice_ud)
        print('Ud,oa,parada[0],aventura',UD,oa,parada[0],aluno_id)
        aluno=self.load(aluno_id)
        # print('teste',aluno)
        # exec(f'{y} = [] \n'
        #      f'print({y})\n'
        #      f'aluno.dados_aventura_1[z]={{{y}.append(parada)}}')
        # if
        aluno.dados_aventura_1[UD]={oa :parada}
        print('ud,oa',UD,oa)
        # aluno.dados_aventura_1[z]={exec(f'{y}').append(parada)}
        # if aluno.dados_aventura_1[z.encode]=={y:parada[0]}:
        #     pass
        aluno.save()
        print('aluno_tudo',aluno.dados_aventura_1)
        print('aluno_1',aluno.dados_aventura_1[UD.encode('utf-8')])
        print('teste',parada,
              parada[0],
              parada[1],
              parada[0]['nivel'],
              parada[0]['percentualConcluido'],
              parada[0]['termino'],OA)

    # def mostrar_desempenho_aluno_AO(self,id_aluno,oa):
    #     objeto_aprendizagem_all=[letter for letter in oa]
    #     # oa=
    #     # ud=
    #     # av=