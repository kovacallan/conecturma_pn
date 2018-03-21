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
        itens = self.facade.ver_item_loja_facade()

        for aluno in alunos:
            self.facade.DeleteAlunoFacade(aluno['id'])

        for item in itens:
            self.facade.deletar_item(item['id'])

    def test_create_user(self):
        alunos = self.facade.ReadAlunoFacade()
        self.assertIn("egg", alunos[0]["usuario_nome"], alunos)

    def _test_search_user(self):
        aluno = self.facade.PesquisaAlunoFacade("egg")
        self.assertIn("egg", aluno.usuario_nome, aluno)

    def test_ponto_jogo(self):
        aluno = self.facade.PesquisaAlunoFacade("egg")
        self.assertTrue(self.facade.PontoJogoFacade(usuario=aluno.usuario_nome, jogo="j1", ponto=1))
        self.assertTrue(self.facade.PontoJogoFacade(usuario=aluno.usuario_nome, jogo="j2", ponto=1))
        self.assertFalse(self.facade.PontoJogoFacade(usuario=aluno.usuario_nome, jogo="j10", ponto=1))
        self.assertFalse(self.facade.PontoJogoFacade(usuario=aluno.usuario_nome, jogo="j135", ponto=1))

    def test_crud_item(self):
        item = self.facade.ver_item_loja_facade()
        for teste in item:
            self.assertIn("egg", teste['nome'], teste)

    def test_search_item(self):
        item = self.facade.ver_item_loja_facade()
        for teste in item:
            search_item = self.facade.PesquisaItemFacade(teste['id'])
            self.assertIn("egg", search_item.nome, search_item)