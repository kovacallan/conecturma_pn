import unittest
# from unittest.mock import MagicMock
from facade.facade import Facade


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()

    def tearDown(self):
        alunos = self.facade.ReadAlunoFacade()
        for oid in alunos['id']:
            self.facade.DeleteAlunoFacade(oid)

    def test_create_user(self):
        self.facade.CreateAlunoFacade("egg", "spam")
        alunos = self.facade.ReadAlunoFacade()
        self.assertIn("egg", alunos['usuario_nome'], alunos)
        for id in alunos['id']:
            self.facade.DeleteAlunoFacade(id)

    def test_search_user(self):
        self.facade.CreateAlunoFacade("egg", "spam")
        aluno = self.facade.PesquisaAlunoFacade("egg")
        self.assertIn("egg", aluno['nome'], aluno)

    def test_life_points(self):
        self.facade.CreateAlunoFacade("egg", "spam")
        self.facade.PontoJogoFacade(usuario="egg", jogo="j1", ponto=15, cliques = 15)
        aluno = self.facade.PesquisaAlunoFacade("egg")
        self.assertIn("egg", aluno['nome'], aluno)
        self.assertEqual(15, aluno['pontos_j1'], aluno)
