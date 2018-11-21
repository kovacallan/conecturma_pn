from facade.facade_main import Facade
from control.dicionarios import TIPO_ESTRUTURA
class RelatorioRede(object):

    def __init__(self):
        self.facade = Facade()
        self._alunos = None
        self._descritores = None
        self._media_alunos = None
        self._pontuacao = None
        self._pontuacao_turma = None
        self._pontuacao_escola = []

    def get_alunos(self, vinculo_rede = None, vinculo_escola = None, vinculo_turma = None):
        if(vinculo_rede != None):
            self._alunos = self.facade.search_aluno_by_rede_facade(vinculo_rede=str(vinculo_rede))
        elif (vinculo_escola != None):
            self._alunos = self.facade.search_aluno_escola_facade(vinculo_escola=str(vinculo_escola))
        elif (vinculo_turma != None):
            self._alunos = self.facade.search_aluno_by_turma_facade(vinculo_turma=str(vinculo_turma))

        print(self._alunos)

        return self._alunos


    def get_descritores(self, serie):
        self._descritores=self.facade.search_descritor_serie_facade(serie=serie)

        return self._descritores


    def get_media_alunos(self, escola):
        alunos = self.get_alunos(vinculo_escola=escola)
        for i in alunos:
            desempenho = self.facade.search_desempenho_concluido_id_aluno_facade(id_aluno=i['id'])
            i['media'] = []
            media = []
            for y in desempenho:
                if 'VC' not in y['objeto_aprendizagem'] and 'CN' not in y['objeto_aprendizagem']:
                    pontuacao_numeric = self.convert_nivel_for_numeric(jogo_jogado=y['jogo_jogado'])
                    pontuacao = 0
                    for z in pontuacao_numeric:
                        pontuacao += int(z)
                    ponto_esperado = 2 * len(pontuacao_numeric)
                    media.append(self.media(ponto=pontuacao, esperado=ponto_esperado))
                    i['media'] = media

            if i['media'] != []:
                i['media'].append(-1)

        return alunos

    def media(self, ponto, esperado):
        if esperado != 0:
            return int((ponto * 100)/esperado)
        return int(ponto * 100)

    def get_pontuacao_escola(self, medias):
        lista = []
        t = 0
        for index,z  in enumerate(self._descritores):
            flag = []
            for i in medias:
                try:
                    if i['media'][index] != [] and i['media'][index] != -1:

                        flag.insert(t, i['media'][index])
                except IndexError:
                    pass
            lista.append(self.calc_media_escola(flag))
        return lista

    def get_media_escola(self, turma_media, descritor):
        escola_ponto = []
        for index,i in enumerate(descritor):
            lista = []
            for z in turma_media:
                try:
                    lista.append(z['media'][index])
                except IndexError:
                    pass
            if lista != []:
                escola_ponto.append(self.calc_media_escola(valores=lista))
        return escola_ponto

    def calc_media_escola(self, valores:list):
        return sum(valores) / len(valores) if valores != [] else -1

    def get_media_rede(self, escola_media, descritor):
        for index,i in enumerate(descritor):
            lista = []
            for z in escola_media:
                try:
                    lista.append(z[index])
                except IndexError:
                    pass
            if lista != []:
                self._pontuacao_escola.append(self.calc_media_rede(valores=lista))

        return self._pontuacao_escola

    def calc_media_rede(self, valores):
        nota = []

        for i in valores:
            if int(i) > 0:
                nota.append(int(i))
        if len(nota) != 0:
            return int(sum(valores) / len(nota))
        return int(sum(valores))

    def convert_nivel_for_numeric(self, jogo_jogado):
        niveis_pontuação = {
            'dificil': 2,
            'medio': 1,
            'facil': 0
        }

        pontuacao = []

        for z in jogo_jogado:
            dict_dado_jogo = self.convertendo_str_in_dict(z)
            if isinstance(dict_dado_jogo, list):
                pass
            elif dict_dado_jogo['termino'] == True:
                pontuacao.append(niveis_pontuação[dict_dado_jogo['nivel']])

        self._pontuacao = pontuacao

        return self._pontuacao

    def media_portugues(self, pontuacao):
        media_portugues = []
        for index,i in enumerate(pontuacao):
            if (index+1) % 2 == 0:
                media_portugues.append(i)
        return self.calc_media(valores=media_portugues)

    def media_matematica(self,pontuacao):
        media_matematica = []
        for index,i in enumerate(pontuacao):
            if (index+1) % 2 != 0:
                media_matematica.append(i)
        return self.calc_media(valores=media_matematica)

    def media_geral(self,pontuacao):
        return self.calc_media(valores=pontuacao)

    def calc_media(self, valores:list):
        nota = []
        soma = 0
        print(valores)
        for i in valores:
            for z in i:
                if int(z) > 0:
                    nota.append(int(z))
            soma+= sum(i)
        if len(nota) != 0:
            return int(soma / len(nota))
        return soma



    def convertendo_str_in_dict(self, str):
        from ast import literal_eval

        python_dict = literal_eval(str)

        return python_dict