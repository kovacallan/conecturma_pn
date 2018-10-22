from facade.facade_main import Facade
class RelatorioTurma(object):

    def __init__(self):
        self.facade = Facade()
        self._alunos = []
        self._descritores = None
        self._desempenho = None
        self._pontuacao = None
        self._porcentagem = None
        self._vezes_jogada = None
        self._media = None
        self._media_final = None
        self._porcentagem_solo = []

    def get_alunos(self, vinculo_rede = None, vinculo_escola = None, vinculo_turma = None):
        if(vinculo_rede != None):
            self._alunos = self.facade.search_aluno_by_rede_facade(vinculo_rede=str(vinculo_rede))
        elif (vinculo_escola != None):
            self._alunos = self.facade.search_aluno_escola_facade(vinculo_escola=str(vinculo_escola))
        elif (vinculo_turma != None):
            for i in self.facade.search_aluno_by_turma_facade(vinculo_turma=str(vinculo_turma)):
                self._alunos.append(i)

        return self._alunos