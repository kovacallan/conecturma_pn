from facade.facade_main import Facade
from control.dicionarios import TIPO_ESTRUTURA
class RelatorioTurma(object):

    def __init__(self):
        self.facade = Facade()
        self._alunos = []
        self._descritores = None
        self._media_alunos = None
        self._pontuacao = None

    def get_alunos(self, vinculo_rede = None, vinculo_escola = None, vinculo_turma = None):
        if(vinculo_rede != None):
            self._alunos = self.facade.search_aluno_by_rede_facade(vinculo_rede=str(vinculo_rede))
        elif (vinculo_escola != None):
            self._alunos = self.facade.search_aluno_escola_facade(vinculo_escola=str(vinculo_escola))
        elif (vinculo_turma != None):
            for i in self.facade.search_aluno_by_turma_facade(vinculo_turma=str(vinculo_turma)):
                self._alunos.append(i)

        return self._alunos


    def get_descritores(self, serie):
        self._descritores=self.facade.search_descritor_serie_facade(serie=serie)

        return self._descritores

    def get_media_alunos(self, turma):
        alunos = self.get_alunos(vinculo_turma=turma)
        for i in alunos:
            desempenho = self.facade.search_desempenho_concluido_id_aluno_facade(id_aluno=i['id'])
            i['media'] = None
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
        return alunos

    def media(self, ponto, esperado):
        return (ponto * 100)/esperado

    def convert_nivel_for_numeric(self, jogo_jogado):
        niveis_pontuação = {
            'dificil': 2,
            'medio': 1,
            'facil': 0
        }

        pontuacao = []

        for z in jogo_jogado:
            dict_dado_jogo = self.convertendo_str_in_dict(z)
            if dict_dado_jogo['termino'] == True:
                pontuacao.append(niveis_pontuação[dict_dado_jogo['nivel']])

        self._pontuacao = pontuacao

        return self._pontuacao

    def convertendo_str_in_dict(self, str):
        from ast import literal_eval

        python_dict = literal_eval(str)

        return python_dict