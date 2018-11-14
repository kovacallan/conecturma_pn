# encoding: utf-8

from control.classes.permissao import usuario_logado

class Relatorio(object):
    def __init__(self):
        self.usuario_logado = usuario_logado()
        self.alunos = None
        self.descritores = None
        self.desempenho = None
        self.pontuacao = None
        self.porcentagem = None
        self.vezes_jogada = None
        self.media = None
        self.media_final = None
        self.porcentagem_solo = []

    def get_alunos(self, usuario_online_dados, nome_turma):
        from facade.aluno_facade import AlunoFacade
        from control.dicionarios import TIPO_USUARIOS

        aluno = AlunoFacade()
        alunos = []

        if usuario_online_dados['tipo'] == TIPO_USUARIOS['administrador']:
            for i in aluno.read_aluno_facade():
                i['vinculo_turma'] = nome_turma(i['vinculo_turma'])
                alunos.append(i)

        elif usuario_online_dados['tipo'] == TIPO_USUARIOS['gestor']:
            for i in aluno.search_aluno_by_rede_facade(vinculo_rede=usuario_online_dados['vinculo_rede']):
                i['vinculo_turma'] = nome_turma(i['vinculo_turma'])
                alunos.append(i)

        elif usuario_online_dados['tipo'] == TIPO_USUARIOS['administrador']:
            for i in aluno.search_aluno_escola_facade(vinculo_escola=usuario_online_dados['vinculo_escola']):
                i['vinculo_turma'] = nome_turma(i['vinculo_turma'])
                alunos.append(i)
        else:
            for i in aluno.search_aluno_by_turma_facade(vinculo_turma=usuario_online_dados['vinculo_turma']):
                i['vinculo_turma'] = nome_turma(i['vinculo_turma'])
                alunos.append(i)

        self.alunos = alunos


    def get_descritores(self, serie):
        from facade.facade_main import Facade

        facade = Facade()

        self.descritores = facade.search_descritor_serie_facade(serie=serie)

    def get_desempenho(self, descritores, aluno):
        from facade.facade_main import Facade
        facade = Facade()

        pontuacao = []

        for i in descritores:
            if 'VC' not in i['sigla_oa'] and 'CN' not in i['sigla_oa']:
                desempenho = facade.search_oa_facade(id_aluno=aluno['id'], objeto_aprendizagem=i['sigla_oa'])
                pontuacao.append(desempenho)

        self.desempenho = pontuacao

    def set_color_face(self):
        porcentagem = []
        vezes = []
        for i in self.pontuacao:
            vezes.append(len(i))
            if len(i) !=0:
                porcentagem.append(int((sum(i) * 100)/(2 * len(i))))
        self.vezes_jogada = vezes
        self.porcentagem = porcentagem


    def convert_nivel_for_numeric(self):
        niveis_pontuação = {
            'dificil': 2,
            'medio': 1,
            'facil': 0
        }

        dicionario = []
        for i in self.desempenho:
            if i != None:
                pontuacao = []
                for z in i['jogo_jogado']:
                    dict_dado_jogo = self.convertendo_str_in_dict(z)
                    if isinstance(dict_dado_jogo, list):
                        pass
                    if dict_dado_jogo['termino'] == True:
                        pontuacao.append(niveis_pontuação[dict_dado_jogo['nivel']])
                dicionario.append(pontuacao)

        self.pontuacao = dicionario

    def set_pontuacao_porcentagem(self):
        for i in self.pontuacao:
            tamanho = len(i)
            porcentagem = []
            z = 1
            while z <= tamanho:
                porcentagem.append(int((sum(i[0:z]) * 100) / (2 * z)))
                z+=1
            self.porcentagem_solo.append(porcentagem)

    def get_matematica_or_portugues_descritor(self, serie, diciplina):
        from facade.facade_main import Facade
        facade = Facade()
        self.descritores = facade.search_descritor_serie_diciplina_facade(serie = serie, diciplina=diciplina)

    def media_portugues(self):
        media_portugues = []
        for index,i in enumerate(self.porcentagem):
            if (index+1) % 2 == 0:
                media_portugues.append(i)

        return self.calc_media(valores=media_portugues)

    def media_matematica(self):
        media_matematica = []
        for index,i in enumerate(self.porcentagem):
            if (index+1) % 2 != 0:
                media_matematica.append(i)

        return self.calc_media(valores=media_matematica)

    def media_geral(self):
        return self.calc_media(valores=self.porcentagem)

    def calc_media(self, valores:list):
        if len(valores) == 0:
            return sum(valores)
        else:
            return int(sum(valores) / len(valores))

    def convertendo_str_in_dict(self, str):
        from ast import literal_eval

        python_dict = literal_eval(str)

        return python_dict