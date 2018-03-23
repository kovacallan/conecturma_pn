import unittest
# from unittest.mock import MagicMock
from bottle import response

from src.facade.facade import *


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()
        self.facade.create_aluno_facade("egg", "spam")
        self.facade.criar_item_loja_facade("egg", 1, 10)
        self.facade.create_turma_facade("ni", "egg")

    def tearDown(self):
        alunos = self.facade.read_aluno_facade()
        escolhidos = []
        for aluno in alunos:
            escolhidos += [aluno['id']]
        self.facade.delete_aluno_facade(escolhidos)
        turmas = self.facade.read_turma_facade()
        for turma in turmas:
            self.facade.delete_turma_facade(turma['id'])


        response.delete_cookie("login")


    """TESTE USUARIO/ALUNO"""

    def _test_create_user(self):
        self.facade.create_aluno_facade("egg", "spam")
        alunos = self.facade.read_aluno_facade()
        self.assertIn("egg", alunos[1]["usuario_nome"], alunos)

    def test_search_user(self):
        self.facade.create_aluno_facade("egg", "spam")
        aluno = self.facade.pesquisa_aluno_facade("egg")
        self.assertIn("egg", aluno.usuario_nome, aluno)

    def _test_ponto_jogo(self):
        aluno = self.facade.pesquisa_aluno_facade("egg")
        print(aluno)
        self.facade.ponto_jogo_facade(usuario="egg",jogo= 'j1',ponto= 1)
        print(self.facade.ponto_jogo_facade(usuario="egg",jogo= 'j1',ponto= 1))
        # self.facade.ponto_jogo_facade("egg", 'j2', 1)
        # aluno.save()
        self.assertEquals(1, aluno.pontos_j1)
        # self.assertEqual(1, aluno.pontos_j1)
        # self.assert
    def test_delete_aluno_facade(self):
        """Ja feito dentro do tear down"""
        pass

    def test_aluno_in_turma_facade(self):
        self.facade.create_aluno_facade("ni1", "spam")
        self.facade.create_aluno_facade("parrot1", "spam")
        self.facade.create_turma_facade("cheese shop1", "egg")
        aluno = self.facade.pesquisa_aluno_facade("ni1")
        aluno2 = self.facade.pesquisa_aluno_facade("parrot1")
        turma = self.facade.pesquisa_turma_facade("cheese shop1")
        self.facade.aluno_in_turma_facade([aluno.get_id(), aluno2.get_id()], turma.get_id())
        print(aluno.turma_do_aluno)
        self.assertEqual("cheese shop1", aluno.turma_do_aluno)

    def _test_compra_item_facade(self):
        aluno=self.facade.pesquisa_aluno_facade("egg")
        item=self.facade.pesquisa_item_facade(id)
        self.facade.compra_item_facade(aluno.get_id(),)

    def test_ver_item_comprado_facade(self):
        aluno = self.facade.pesquisa_aluno_facade("egg")
        self.facade.ver_item_comprado_facade(aluno.get_id())

    def _test_equipar_item_facade(self):
        aluno=self.facade.pesquisa_aluno_facade("egg")
        self.facade.equipar_item_facade(aluno.get_id(),aluno)


    def test_avatar_facade(self):

        pass


    def _test_search_turma(self):
        turma = self.facade.pesquisa_turma_facade("dread")
        print(turma)
        self.assertEquals("dread", turma.turma_nome, turma)

    """FIM DE TESTE USUARIO"""

    def _test_crud_item(self):
        item = self.facade.ver_item_loja_facade()
        for teste in item:
            self.assertIn("egg", teste['nome'], teste)

        for id in item:
            self.facade.deletar_item(id['id'])

    def _test_search_item(self):
        item = self.facade.ver_item_loja_facade()
        for teste in item:
            search_item = self.facade.pesquisa_item_facade(teste['id'])
            self.assertIn("egg", search_item.nome, search_item)

    def _test_life_points(self):
        self.facade.create_aluno_facade("egg", "spam")
        self.facade.ponto_jogo_facade(usuario="egg", jogo="j1", ponto=15, clique=10)
        aluno = self.facade.pesquisa_aluno_facade("egg")
        self.assertIn("egg", aluno['nome'])
        self.assertEqual(15, aluno['pontos_j1'], aluno)
        self.assertEqual(30, aluno['total_cliques_j1'], aluno)

    def _test_create_turma(self):
        self.facade.create_turma_facade("dead", "parrot")
        turma1 = self.facade.read_turma_facade()
        self.assertIn("dead", turma1[0]['nome'], turma1)
        self.assertIn("parrot", turma1[0]['criador'], turma1)

    def _test_aluno_in_turma(self):
        self.facade.create_turma_facade("dead", "parrot")
        self.facade.create_turma_facade("KND", "egg")
        self.facade.create_aluno_facade("spam", "egg")
        self.facade.create_aluno_facade("knights", "Ni")
        self.facade.aluno_in_turma_facade(escolhidos=[""])

