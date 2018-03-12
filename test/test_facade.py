import unittest
# from unittest.mock import MagicMock
from src.facade.facade import *


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()
        self.facade.CreateAlunoFacade("egg", "spam")
        self.facade.CriarItemLojaFacade("egg", 1, 10)

    def _tearDown(self):
        alunos = self.facade.ReadAlunoFacade()
        for aluno in alunos:
            self.facade.DeleteAlunoFacade(aluno['id'])

    def test_create_user(self):
        alunos = self.facade.ReadAlunoFacade()
        self.assertIn("egg", alunos[0]["usuario_nome"], alunos)
        for id in alunos:
            self.facade.DeleteAlunoFacade(id)

    def _test_search_user(self):
        aluno = self.facade.PesquisaAlunoFacade("egg")
        self.assertIn("egg", aluno.usuario_nome, aluno)

    def test_ponto_jogo(self):
        pass

    def test_crud_item(self):
        item = self.facade.VerItemLojaFacade()
        for teste in item:
            self.assertIn("egg", teste['nome'], teste)

        for id in item:
            self.facade.deletar_item(id['id'])

    def test_search_item(self):
        item = self.facade.VerItemLojaFacade()
        for teste in item:
            search_item = self.facade.PesquisaItemFacade(teste['id'])
            self.assertIn("egg", search_item.nome, search_item)

