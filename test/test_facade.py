import unittest
# from unittest.mock import MagicMock
import bottle

from src.facade.facade import *


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()
        self.facade.CreateAlunoFacade("egg", "spam")

    def tearDown(self):
        alunos = self.facade.ReadAlunoFacade()
        for aluno in alunos:
            self.facade.deleteAlunoFacade(aluno['id'])

    def test_create_user(self):
        self.facade.CreateAlunoFacade("egg", "spam")
        alunos = self.facade.ReadAlunoFacade()
        self.assertIn("egg", alunos[0]["usuario_nome"], alunos)
        # for aluno in alunos:
        #     self.facade.deleteAlunoFacade(aluno['id'])

    def _test_search_user(self):
        aluno = self.facade.PesquisaAlunoFacade("egg")
        self.assertIn("egg", aluno['nome'], aluno)

    def test_life_points(self):
        self.facade.CreateAlunoFacade("egg", "spam")
        self.facade.PontoJogoFacade(usuario="egg", jogo="j1", ponto=15, cliques=15)
        aluno = self.facade.PesquisaAlunoFacade("egg")
        self.assertIn("egg", aluno['nome'], aluno)
        self.assertEqual(15, aluno['pontos_j1'], aluno)
        self.assertEqual(30, aluno['total_cliques_j1'], aluno)

    def test_create_turma(self):
        self.facade.CreateTurmaFacade("dead", "parrot")
        turma1 = self.facade.ReadTurmaFacade()
        self.assertIn("egg", turma1[0]['criador'], turma1)
        self.facade.CreateTurmaFacade("KND", "egg")
        turma = self.facade.ReadTurmaFacade()
        self.assertIn("egg", turma[0]['criador'], turma)

    def test_aluno_in_turma(self):
        self.facade.CreateTurmaFacade("dead", "parrot")
        self.facade.CreateTurmaFacade("KND", "egg")
        self.facade.CreateAlunoFacade("spam", "egg")
        self.facade.CreateAlunoFacade("knights", "Ni")


    bottle.response.delete_cookie("login")


"""def _test_cliquej1(self):
    self.facade.PontoJogoFacade(usuario="egg", jogo="j1", ponto=15, cliques_totais=30)
    aluno = self.facade.PesquisaAlunoFacade("egg")
    self.assertIn("egg", aluno['nome'], aluno)
    self.assertEqual(15, 30, aluno['total_cliques_j1'], aluno)

def _test_cliquej2(self):
    self.facade.PontoJogoFacade(usuario="egg", jogo="j2", ponto=15, cliques_totais=30)
    aluno = self.facade.PesquisaAlunoFacade("egg")
    self.assertIn("egg", aluno['nome'], aluno)
    self.assertEqual(15, aluno['total_cliques_j2'], aluno)"""

"""def test_score(self):
    self.facade.PesquisaAlunoFacade("egg")
    self.facade."""
