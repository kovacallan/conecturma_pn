# coding: utf-8
import unittest
# from unittest.mock import MagicMock
import bottle

from src.facade.historico_facade import *


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()

    """TESTE USUARIO/ALUNO"""

    def _create_aluno(self):

        aluno = self.facade.create_aluno_facade("egg", "123")
        self.assertEqual(aluno, True)

    def _create_aluno_senha_vazia(self):
        aluno = self.facade.create_aluno_facade("Brian", "")
        self.assertTrue(aluno, TypeError)

    def _create_aluno_aluno_vazio(self):
        aluno = self.facade.create_aluno_facade(" ", " 123")
        self.asserrTrue(TypeError, True)

    def _create_aluno_fail(self):
        aluno = self.facade.create_aluno_facade("Brian", "123")
        self.assertEqual(aluno, TypeError)

        aluno = self.facade.create_aluno_facade("egg", "")
        self.assertEqual(aluno, True)

    def update_aluno(self):
        aluno = self.facade.pesquisa_aluno_facade("egg")
        updadate = self.facade.update_aluno_facade(aluno.id, "knight", "ni")
        self.assertIs(updadate, True)
        updadate = self.facade.update_aluno_facade(aluno.id, "egg", "")
        self.assertIs(updadate, False)

    def _pesquisa_aluno(self):
        aluno = self.facade.pesquisa_aluno_facade("Brian")
        self.assertIs(aluno, aluno)
        aluno = self.facade.pesquisa_aluno_facade("Sily walk")
        self.assertIs(aluno, None)

    def _pontos_jogo(self):
        aluno = self.facade.ponto_jogo_facade("Brian", "j1", 1)
        self.assertIs(aluno, True)
        aluno = self.facade.ponto_jogo_facade("Brian", "j1", None)
        self.assertIs(aluno, False)

    def _delete_alunos(self):
        alunos = self.facade.read_aluno_facade()
        escolhidos = []
        for aluno in alunos:
            escolhidos += [aluno['id']]
        self.facade.delete_aluno_facade(escolhidos)

    def _test_mudar_senha(self):
        """
        Cria usuario, o facade deve receber a senha antiga e a nova

        :return:None
        """
        aluno = self.facade.create_aluno_facade("egg", "123")
        aluno1 = self.facade.pesquisa_aluno_facade("egg")
        self.facade.new_senha_facade(aluno1.id, "123", "321")

    def _test_mudar_usuario_nome(self):
        aluno = self.facade.pesquisa_aluno_facade("egg")
        self.facade.new_nome_user_facade(aluno.id, "egg", "123" "spam")

    def test_anotacoes_no_aluno(self):
        x=0
        self.facade.create_aluno_facade('spam','123')
        aluno=self.facade.pesquisa_aluno_facade('spam')
        self.facade.aluno.anotacoes_aluno()

    """Métododos de Test"""

    def test_create_aluno(self):
        self._create_aluno()

    def test_create_aluno_senha_vazia(self):
        self._create_aluno_senha_vazia()

    @unittest.expectedFailure
    def test_all_aluno(self):
        self._create_aluno_fail()
        self._update_aluno()
        self._pesquisa_aluno()
        self._pontos_jogo()
        self._create_aluno_aluno_vazio()
        self._delete_alunos()

    def _test_create_aluno_fail(self):
        self._create_aluno_fail()

    def _test_create_update_aluno(self):
        self._update_aluno()

    def _test_pesquisa_aluno(self):
        self._pesquisa_aluno()

    def _test_pontos_jogo(self):
        self._pontos_jogo()

    def _test_delete_alunos(self):

        self._delete_alunos()

    def _test_all_aluno(self):
        self._create_aluno_fail()
        self._update_aluno()
        self._pesquisa_aluno()
        self._pontos_jogo()
        self._delete_alunos()



    """FIM TESTE USUARIO/ALUNO"""

    """INICIO TESTE OBSERVADOR"""

    def _create_observador(self):
        observador = self.facade.create_observador_facade(nome='Egg', senha='span', telefone='(21)9999-9999',
                                                          cpf='123456789', email='egg@span.com.br', tipo='ADMINISTRADOR')

        observador_professor = self.facade.create_observador_facade(nome='Monty', senha='python', telefone='(21)9999-9999',
                                                          cpf='123456789', email='Monty@python.com.br',
                                                          tipo='ADMINISTRADOR')
        self.assertIs(observador, True)

    def _update_observador(self):
        observador = self.facade.search_observador_facade('Egg')
        observador_update = self.facade.update_observador_facade(id=observador['id'], nome='Knight',
                                                                 telefone='(11)8888-8888', cpf='999999999',
                                                                 email='knight@ni.com')
        observador = self.facade.search_observador_facade('Knight')
        self.assertEqual(observador['nome'], 'Knight')
        self.assertEqual(observador['telefone'], '(11)8888-8888')
        self.assertEqual(observador['cpf'], '999999999')
        self.assertEqual(observador['email'], 'knight@ni.com')

    def _search_observador(self):
        observador = self.facade.search_observador_facade('Egg')
        self.assertEqual(observador['nome'], 'Egg')
        self.assertEqual(observador['senha'], 'span')
        self.assertEqual(observador['telefone'], '(21)9999-9999')
        self.assertEqual(observador['cpf'], '123456789')
        self.assertEqual(observador['email'], 'egg@span.com.br')
        self.assertEqual(observador['tipo'], 'ADMINISTRADOR')
        observador = self.facade.search_observador_facade('Ni')
        self.assertIs(observador, None)

    def _delete_observador(self):
        observador = self.facade.read_observador_facade()
        escolhidos = []
        for observados in observador:
            escolhidos.append(observados['id'])
        self.facade.delete_observador_facade(escolhidos)

    def test_create_delete_observador(self):
        self._create_observador()
        self._delete_observador()

    def test_create_search_delete_observador(self):
        self._create_observador()
        self._search_observador()
        self._delete_observador()

    def test_create_update_delete_observador(self):
        self._create_observador()
        self._update_observador()
        self._delete_observador()

    """FIM TESTE OBSERVADOR"""

    """TESTE REDE"""

    def _create_rede(self):
        rede = self.facade.create_rede_facade("egg", "2546", "(21)9999-9999")
        self.assertIs(rede, True)

    def _update_rede(self):
        rede = self.facade.create_rede_facade("egg", "2546", "(21)9999-9999")
        rede = self.facade.pesquisa_rede_facade("egg")
        self.facade.update_rede_facade(rede.id, "Ni", "2222", "(11)8888-8888")
        rede = self.facade.pesquisa_rede_facade("Ni")
        self.assertEqual(rede.nome, "Ni")
        self.assertEqual(rede.cod, "2222")
        self.assertEqual(rede.telefone, "(11)8888-8888")

    def _pesquisa_rede(self):
        rede = self.facade.pesquisa_rede_facade("Ni")
        self.assertIs(rede, rede)
        rede = self.facade.pesquisa_rede_facade("Sily walk")
        self.assertIs(rede, None)

    def _delete_rede(self):
        rede = self.facade.read_rede_facade()
        escolhidos = []
        for redes in rede:
            escolhidos.append(redes['id'])
        self.facade.delete_rede_facade(escolhidos)

    def test_create_rede(self):
        self._create_rede()

    def test_update_rede(self):
        self._update_rede()

    def test_pesquisa_rede(self):
        self._pesquisa_rede()

    def test_delete_rede(self):
        self._update_rede()
        self._delete_rede()

    """FIM TESTE REDE"""

    """TESTE FACADE ESCOLA"""

    def _create_escola(self):
        escola = self.facade.create_escola_facade('Do bairro', 'de baixo', '665', '21 ', 'RJ', 'Pindamonhagaba',
                                                  'KNDPI','1234de')
        self.assertIs(escola, True)

    def _update_escola(self):
        escola = self.facade.pesquisa_escola_facade("Do bairro")
        self.facade.update_escola_facade(escola['id'], "Ni", "eggs", "88", "RIO DE JANEIRO",'RJ',"33355567", "abelhinha", "KND2",)
        escola = self.facade.pesquisa_escola_facade("Ni")
        self.assertEqual(escola['nome'], "Ni")
        self.assertEqual(escola['rua'], "eggs")
        self.assertEqual(escola['numero'], 88)
        self.assertEqual(escola['rede_pertencente'], "abelhinha")
        self.assertEqual(escola['telefone'], "33355567")
        self.assertEqual(escola['cod_identificacao'], "KND2")
    def _pesquisa_escola(self):
        escola = self.facade.pesquisa_escola_facade("Do bairro")
        self.assertIs(escola, escola)
        escola = self.facade.pesquisa_escola_facade("Sily walk")
        self.assertIs(escola, None)
        pass

    def test_pesquisa_escola(self):
        self._pesquisa_escola()


    def _delete_escola(self):
        escola = self.facade.read_escola_facade()
        escolhidos = []
        for escola in escola:
            escolhidos.append(escola['id'])
        self.facade.delete_escola_facade(escolhidos)

    def test_create_escola(self):
        self._create_escola()

    def _test_update_escola(self):
        self._update_escola()

    def test_pesquisa_escola(self):
        self._pesquisa_escola()

    def test_delete_escola(self):
        self._update_rede()
        self._delete_rede()

    """FIM TESTE ESCOLA"""
    """TESTE TURMA"""

    def _create_turma(self):
        turma = self.facade.create_turma_facade("Knight", "Ni")

    def _search_turma(self):
        turma = self.facade.search_turma_facade("Knight")
        self.assertIn(turma['nome'], "Knight")
        self.assertIn(turma['criador'], "Ni")

    def _vincular_professor_turma(self):
        turma = self.facade.search_turma_facade("Knight")
        professor = self.facade.search_observador_facade("Monty")
        self.facade.vincular_professor_turma_facade(turma['id'], professor['id'])

    def _ver_professor_turma(self):
        turma = self.facade.search_turma_facade("Knight")
        professor_vinculado = self.facade.ver_professor_turma_facade(turma['id'])
        for p in professor_vinculado:
            prof = p
        professor = self.facade.search_observador_id_facade(prof)

        self.assertEqual(professor.nome, 'Monty')
        self.assertEqual(professor.email, 'Monty@python.com.br')

    def _delete_turma(self):
        turma = self.facade.read_turma_facade()

        escolhidos = []
        for turmas in turma:
            escolhidos.append(turmas['id'])
        self.facade.delete_turma_facade(escolhidos)

    def test_create_delete_turma(self):
        self._create_turma()
        self._delete_turma()

    def test_vincular_professor_turma(self):
        self._create_turma()
        self._create_observador()
        self._vincular_professor_turma()
        self._ver_professor_turma()
        self._delete_observador()
        self._delete_turma()


    def test_create_search_delete_turma(self):
        self._create_turma()
        self._search_turma()
        self._delete_turma()

    """FIM TESTE TURMA """

    """TESTE FACADE HISTORICO"""
    def _create_historico(self):
        self.facade.create_historico_facade("Egg", "ADMINISTRADOR")

    def _read_historico(self):
        historico = self.facade.read_historico_facade()

        self.assertTrue(historico, [])

    def test_create_historico(self):
        self._create_aluno()

    def _test_read_historico(self):
        self._read_historico()


    """FIM TESTE FACADE HISTORICO"""

    """TESTE FACADE MEDALHAS"""

    def _create_medalha(self):
        medalha = self.facade.create_medalha_facade('cheese')
        self.assertIs(medalha, True)

    def test_create_escola(self):
            self._create_escola()

    if __name__ == '__main__':
        unittest.main()
