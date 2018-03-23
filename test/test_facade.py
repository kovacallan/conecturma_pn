import unittest
# from unittest.mock import MagicMock
import bottle

from src.facade.facade import *


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()

    """TESTE USUARIO/ALUNO"""

    """CREATE"""

    def _create_aluno(self):
        aluno = self.facade.create_aluno_facade("egg", "123")
        self.assertEqual(aluno, True)

    def _create_aluno_senha_vazia(self):
        aluno = self.facade.create_aluno_facade("Brian", "")
        self.assertTrue(aluno, TypeError)

    def _create_aluno_fail(self):
        aluno = self.facade.create_aluno_facade("Brian", "123")
        self.assertEqual(aluno, TypeError)

        aluno = self.facade.create_aluno_facade("egg", "")
        self.assertEqual(aluno, True)

    """FIM CREATE"""

    """UPDATE"""

    def _update_aluno(self):
        aluno = self.facade.pesquisa_aluno_facade("egg")
        updadate = self.facade.update_aluno_facade(aluno.id, "knight", "ni")
        self.assertTrue(updadate, True)
    """FIM UPDATE"""

    """DELETE"""

    def _delete_alunos(self):
        alunos = self.facade.read_aluno_facade()
        escolhidos = []
        for aluno in alunos:
            escolhidos += [aluno['id']]
        self.facade.delete_aluno_facade(escolhidos)

    """FIM DELETE"""

    def test_create_aluno(self):
        self._create_aluno()

    def test_create_aluno_senha_vazia(self):
        self._create_aluno_senha_vazia()

    @unittest.expectedFailure
    def test_create_aluno_fail(self):
        self._create_aluno_fail()

    def test_create_update_aluno(self):
        self._update_aluno()

    def test_delete_alunos(self):
        self._delete_alunos()

    """FIM TESTE USUARIO/ALUNO"""
