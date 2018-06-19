# coding: utf-8
import unittest
import redis
from datetime import date, datetime

# from unittest.mock import MagicMock
# from src.model.estrutura_model import DbEstrutura
"""possivel erro de importaçao de DbAluno acima"""
from src.facade.facade_main import Facade
from control.dicionarios import TIPO_ESTRUTURA, TIPO_USUARIOS, TIPO_ITEM


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()
        # self._create_rede()
        # self._create_escola()
        # self._create_turma()
        # self._create_aluno()
        # self._create_turma()
        self._create_all_estruturas()
        self._create_all()


    """TESTE ALUNO FACADE"""

    def _create_all(self):
        self._create_rede()
        self._create_escola()
        self._create_turma()
        self._create_aluno()
        self._create_turma()
        self._create_observador()

    def test_create_all(self):
        self._create_all()

    def _create_aluno(self):
        rede = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'], nome="ACNE")
        self.assertIsNot(rede, None)
        escola = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='Escola conecturma')
        self.assertIsNot(escola, None)
        esco_spo = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='estalo')
        self.assertIsNot(esco_spo, None)

        aluno1 = self.facade.create_aluno_facade(nome='egg', matricula='2345', escola=str(escola['id']), senha='123',
                                                 vinculo_rede=str(rede['id']), data_nascimento=date(1994, 5, 2),
                                                 sexo='masculino')
        self.assertEqual(aluno1, True)
        aluno2 = self.facade.create_aluno_facade(nome="hilter", matricula="234", escola=str(escola['id']), senha="123",
                                                 vinculo_rede='0', data_nascimento=date(1994, 2, 5), sexo='feminino',)
        self.assertEqual(aluno2, True)
        aluno3 = self.facade.create_aluno_facade(nome="Ni", matricula="42069", escola=str(escola['id']), senha='123',
                                                 vinculo_rede='0', data_nascimento=date(1500, 5, 21), sexo='feminino')
        self.assertEqual(aluno3, True)
        aluno4 = self.facade.create_aluno_facade(nome="thanos", matricula='2929', escola=str(esco_spo['id']),
                                                 senha="123",
                                                 vinculo_rede="0", data_nascimento=date(2018, 5, 9), sexo='masculino')
        self.assertEqual(aluno4, True)

    def _test_create_delete_aluno(self):
        self._create_aluno()

    def _read_aluno(self):
        # self._create_aluno()
        aluno4 = self.facade.search_aluno_nome_facade(nome="egg")
        self.assertIn(aluno4['nome'], self.facade.read_aluno_facade()[-1]['nome'])

    def test_read_aluno(self):
        self._read_aluno()

    def _update_aluno(self):
        # self._create_aluno()
        aluno1 = self.facade.search_aluno_nome_facade(nome="egg")
        x = aluno1['id']
        self.facade.update_aluno_facade(aluno1['id'], "knight", "321")
        aluno2 = self.facade.search_aluno_nome_facade("knight")
        y = aluno2['id']
        self.assertEqual(x, y)

    def test_update_aluno(self):
        self._update_aluno()

    def _search_aluno_escola(self):
        escola = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='Escola conecturma')
        alunos_conecturma = self.facade.search_aluno_escola_facade(str(escola['id']))
        self.assertEqual(3, len(alunos_conecturma))

    def test_pesquisa_alunos_de_uma_escola(self):
        self._search_aluno_escola()

    def _search_aluno_nome(self):
        aluno = self.facade.search_aluno_nome_facade(nome='hilter')
        self.assertIsNot(aluno, None)

    def test_pesquisa_nome(self):
        self._search_aluno_nome()

    def _search_aluno_todo_objeto(self):
        aluno = self.facade.search_aluno_nome_objeto_facade(nome='egg')
        self.assertIsNot(aluno, None)

    def test_pesquisa_objeto_aluno(self):
        self._search_aluno_todo_objeto()

    def _vincular_aluno_em_turma(self):
        aluno = self.facade.search_aluno_nome_facade(nome='thanos')
        self.assertIsNot(aluno, None)
        aluno2 = self.facade.search_aluno_nome_facade(nome='Ni')
        self.assertIsNot(aluno2, None)
        alunos_para_turma = [aluno['id'], aluno2['id']]
        turma = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'], nome='Knight')
        self.assertIsNot(turma, None)
        self.facade.aluno_in_turma_facade(alunos_para_turma, turma['id'])
        aluno_pos = self.facade.search_aluno_nome_facade(nome='thanos')
        self.assertEqual(aluno_pos['vinculo_turma'], str(turma['id']))
        self.assertEqual(aluno_pos['vinculo_serie'], str(turma['serie']))
        aluno_pos2 = self.facade.search_aluno_nome_facade(nome='Ni')
        self.assertEqual(aluno_pos2['vinculo_turma'], str(turma['id']))
        self.assertEqual(aluno_pos2['vinculo_serie'], str(turma['serie']))

    def test_vincular_aluno_na_turma(self):
        self._vincular_aluno_em_turma()

    def _comprar_item(self):
        self._create_item()
        aluno1 = self.facade.search_aluno_nome_objeto_facade(nome="egg")
        self.assertIsNot(aluno1, None)
        item1 = self.facade.search_estrutura_facade(nome="burroquandofoge", tipo_estrutura=TIPO_ESTRUTURA['item'])
        self.assertIsNot(item1, None)
        item2 = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'], nome='cara de pau')
        self.assertIsNot(item2, None)
        item3 = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'], nome='cauda de furry')
        self.assertIsNot(item3, None)
        # itens = [str(item1['id']).encode('utf-8'), str(item2['id']).encode('utf-8'), str(item3['id']).encode('utf-8')]
        self.facade.compra_item_facade(aluno1.id, item1['id'])
        self.assertIn(str(item1['id']).encode('utf-8'), aluno1.itens_comprados[0])
        self.facade.compra_item_facade(aluno1.id, item2['id'])
        self.assertIn(str(item2['id']).encode('utf-8'), aluno1.itens_comprados[1])
        self.facade.compra_item_facade(aluno1.id, item3['id'])
        self.assertIn(str(item3['id']).encode('utf-8'), aluno1.itens_comprados[2])

    def test_compra_item(self):
        self._comprar_item()

    def _ver_iten_comprado(self):
        self._comprar_item()
        aluno1 = self.facade.search_aluno_nome_objeto_facade("egg")
        iten = self.facade.ver_item_comprado_facade(aluno1.id)
        self.assertEqual(aluno1.itens_comprados[0].decode('UTF-8'), iten[0])
        self.assertEqual(aluno1.itens_comprados[1].decode('UTF-8'), iten[1])
        self.assertEqual(aluno1.itens_comprados[2].decode('UTF-8'), iten[2])

    def test_ver_itens_comprados(self):
        self._ver_iten_comprado()

    def _equipar_item(self):
        self._comprar_item()
        aluno1 = self.facade.search_aluno_nome_facade(nome="egg")
        self.assertIsNot(aluno1, None)
        iten = self.facade.search_estrutura_facade(tipo_estrutura='5', nome="burroquandofoge")
        self.facade.equipar_item_facade(aluno1['id'], iten)
        aluno_pos = self.facade.search_aluno_nome_facade(nome="egg")
        self.assertEqual(aluno_pos['cor'], str(iten['id']))

    def teste_equipando_item(self):
        self._equipar_item()

    def _mostrar_avatar(self):
        self._equipar_item()
        aluno1 = self.facade.search_aluno_nome_facade("egg")
        avatar = self.facade.avatar_facade(aluno1['id'])
        iten1 = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'], nome="burroquandofoge")
        self.assertEqual(avatar['cor'], str(iten1['id']))

    def test_ver_avatar(self):
        self._mostrar_avatar()

    def _anotacoes_no_aluno(self):
        mensagem2 = "tetativa..."
        mensagem = "Isto é uma mensagem de teste"
        aluno1 = self.facade.search_aluno_nome_objeto_facade(nome="egg")
        self.assertIsNot(aluno1, None)
        self.facade.anotacoes_aluno_facade(aluno1.id, mensagem)
        self.facade.anotacoes_aluno_facade(aluno1.id, mensagem2)
        self.assertEqual(aluno1.anotacoes_aluno[0], mensagem.encode('utf-8'))
        self.assertEqual(aluno1.anotacoes_aluno[1], mensagem2.encode('utf-8'))

    def test_anotacoes_no_aluno(self):
        self._anotacoes_no_aluno()

    def _read_anotacoes_no_aluno(self):
        self._anotacoes_no_aluno()
        aluno1 = self.facade.search_aluno_nome_facade(nome="egg")
        self.assertIsNot(aluno1, None)
        read = self.facade.read_anotacoes_aluno_facade(aluno1['id'])
        self.assertIn("Isto é uma mensagem de teste", read)

    def test_read_anotacoes_aluno(self):
        self._read_anotacoes_no_aluno()

    def _pesquisa_alunos_na_rede(self):
        aluno = self.facade.search_aluno_nome_facade(nome='egg')
        self.assertIsNot(aluno, None)
        rede = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="ACNE")
        alunos_in_rede = self.facade.search_aluno_by_rede_facade(rede['id'])
        self.assertEqual(alunos_in_rede[0]['vinculo_rede'], aluno['vinculo_rede'])

    def test_pesquisa_alunos_da_rede(self):
        self._pesquisa_alunos_na_rede()

    def _pesquisa_alunos_na_turma(self):
        self._vincular_aluno_em_turma()
        aluno = self.facade.search_aluno_nome_facade(nome='thanos')
        turma = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'], nome='Knight')
        self.assertIsNot(turma, None)
        alunos_in_turma = self.facade.search_aluno_by_turma_facade(turma['id'])
        self.assertEqual(alunos_in_turma[1]['vinculo_turma'], aluno['vinculo_turma'])

    def test_pesquisa_alunos_by_turma(self):
        self._pesquisa_alunos_na_turma()

    def _test_create_aluno_senha_vazia(self):
        self._create_aluno_senha_vazia()

    def _create_aluno_senha_vazia(self):
        aluno = self.facade.create_aluno_facade("Brian", "")
        self.assertTrue(aluno, TypeError)

    def _create_aluno_aluno_vazio(self):
        aluno = self.facade.create_aluno_facade(" ", " 123")
        self.assertTrue(TypeError, True)

    def _create_aluno_fail(self):
        aluno = self.facade.create_aluno_facade(nome="Brian", senha="123", escola="nao sei", vinculo_rede="0")
        self.assertEqual(aluno, TypeError)
        aluno = self.facade.create_aluno_facade("egg", "")
        self.assertEqual(aluno, True)

    def _create_aluno_sem_escola(self):
        aluno = self.facade.create_aluno_facade("Nemo", "", "123")
        self.assertEqual(aluno, TypeError)

    @unittest.expectedFailure
    def test_all_aluno(self):
        self._create_aluno_fail()
        # self._update_aluno()
        # self._pesquisa_aluno()
        self._create_aluno_aluno_vazio()
        self._create_aluno_sem_escola()

    def _test_create_aluno_fail(self):
        self._create_aluno_fail()

    def _test_create_update_aluno(self):
        self._update_aluno()

    def _test_all_aluno(self):
        self._create_aluno_fail()
        self._update_aluno()

    """FIM TESTE ALUNO"""

    """INIICIO DE TESTES ESTRUTURA FACADE"""

    """TESTE REDE"""

    def _create_all_estruturas(self):
        self._create_rede()

    def _create_escola(self):
        escola = self.facade.create_estrutura_facade(nome='Do bairro', tipo_estrutura=TIPO_ESTRUTURA['escola'])
        self.assertIsNot(escola, None)
        escola_conect = self.facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'],
                                                            nome='Escola conecturma', telefone='2569 6969',
                                                            cep='22231 666', estado='Rio de Janeiro', uf='RJ',
                                                            numero='51')
        self.assertIsNot(escola_conect, None)
        escola_spoiler = self.facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='estalo',
                                                             telefone='2569 4200', cep='22134 000',
                                                             estado='Rio de Janeiro', uf='RJ', numero='67')
        self.assertIsNot(escola_spoiler, None)
        rede = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'], nome='Espinha')
        self.assertIsNot(rede, None)
        escola_rede = self.facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='esc rede',
                                                          telefone='2211 4567', cep='22993 455', estado='SOLIDO',
                                                          uf='RJ', numero='28', vinculo_rede=str(rede['id']))
        self.assertIsNot(escola_rede, None)

    def _create_rede(self):
        rede = self.facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'], nome="ACNE",
                                                   telefone="(21)9999-9999")
        self.assertIsNot(rede, None)
        rede2 = self.facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'], nome="Espinha")

        self.assertIsNot(rede2, None)

    def _update_rede(self):
        rede = self.facade.create_estrutura_facade(nome="egg", tipo_estrutura=TIPO_ESTRUTURA['rede'],
                                                   telefone="(21)9999-9999")
        self.assertIsNot(rede, None)
        rede1 = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'], nome="egg")
        self.assertIsNot(rede1, None)

        rede_up = self.facade.update_estrutura_facade(rede1['id'], nome='Ni', telefone="(11)8888-8888")
        rede = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="Ni")
        # print("L310",rede_up)
        self.assertEqual(rede['nome'], "Ni")
        self.assertEqual(rede['telefone'], "(11)8888-8888")

    def _pesquisa_rede(self):
        rede = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="Ni")
        self.assertIs(rede, rede)
        rede1 = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="Sily walk")
        self.assertIs(rede1, None)

    def test_create_rede(self):
        self._create_rede()

    def test_update_rede(self):
        self._update_rede()

    def test_pesquisa_rede(self):
        self._pesquisa_rede()

    """FIM TESTE REDE"""

    """TESTE FACADE ESCOLA"""

    def _create_escola(self):
        escola = self.facade.create_estrutura_facade(nome='Do bairro', tipo_estrutura=TIPO_ESTRUTURA['escola'])
        self.assertIsNot(escola, None)
        escola_conect = self.facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'],
                                                            nome='Escola conecturma', telefone='2569 6969',
                                                            cep='22231 666', estado='Rio de Janeiro', uf='RJ',
                                                            numero='51')
        self.assertIsNot(escola_conect, None)
        escola_spoiler = self.facade.create_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='estalo',
                                                             telefone='2569 4200', cep='22134 000',
                                                             estado='Rio de Janeiro', uf='RJ', numero='67')
        self.assertIsNot(escola_spoiler, None)

    def _update_escola(self):
        self._create_escola()
        escola = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='Do bairro')
        self.facade.update_estrutura_facade(escola['id'], nome="Ni", telefone="33355567", vinculo_rede="abelhinha",
                                            cep="22270 999", endereco="rua do teste ", numero='666', estado='RJ')
        escola2 = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome="Ni")
        self.assertEqual(escola2['nome'], "Ni")
        self.assertEqual(escola2['endereco'], "rua do teste ")
        self.assertEqual(escola2['numero'], '666')
        self.assertEqual(escola2['vinculo_rede'], "abelhinha")
        self.assertEqual(escola2['telefone'], "33355567")

    def _pesquisa_escola(self):
        escola = self.facade.search_estrutura_facade(tipo_estrutura="2", nome="Do bairro")
        self.assertIs(escola, escola)
        escola1 = self.facade.search_estrutura_facade(tipo_estrutura="2", nome="Sily walk")
        self.assertIs(escola1, None)

    def _delete_escola(self):
        escola = self.facade.read_estrutura_facade("2")
        escolhidos = []
        for escola in escola:
            escolhidos.append(escola['id'])
        # self.facade.delete_estrutura_facade("2",escolhidos)

    def test_create_delete_escola(self):
        self._create_escola()
        # self._delete_escola()

    def test_pesquisa_escola(self):
        self._create_escola()
        self._pesquisa_escola()
        # self._delete_escola()

    def test_update_escola(self):
        self._create_escola()
        self._update_escola()

    def _test_delete_escola(self):
        self._update_rede()
        # self._delete_rede()

    """FIM TESTE ESCOLA"""
    """TESTE TURMA"""

    def _create_turma(self):
        turma1 = self.facade.create_estrutura_facade(nome="Knight", tipo_estrutura="3", serie="1", vinculo_escola="1",
                                                     quem_criou="Ni")
        # print("turma1", turma1)
        self.assertIsNot(turma1, None)

    def _search_turma(self):
        turma1 = self.facade.search_estrutura_facade(tipo_estrutura="3", nome="Knight")
        self.assertIn(turma1['nome'], "Knight")
        self.assertIn(turma1['criador'], "Ni")

    def _vincular_professor_turma(self):
        """esta inplementado como um update de escola """
        turma = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'], nome="Knight")
        professor = self.facade.search_observador_facade("Monty")
        self.facade.update_estrutura_facade(turma['id'])

    def _ver_professor_turma(self):
        turma = self.facade.search_turma_facade("Knight")
        professor_vinculado = self.facade.ver_professor_turma_facade(turma['id'])
        for p in professor_vinculado:
            prof = p
        professor = self.facade.search_observador_id_facade(prof)

        self.assertEqual(professor.nome, 'Monty')
        self.assertEqual(professor.email, 'Monty@python.com.br')

    def _delete_turma(self):
        turmas = self.facade.read_estrutura_facade("3")
        escolhidos = []
        for turmas in turmas:
            escolhidos.append(turmas['id'])
        # self.facade.delete_turma_facade_test(escolhidos)

    def test_create_delete_turma(self):
        self._create_turma()
        self._delete_turma()

    def _test_vincular_professor_turma(self):
        self._create_turma()
        self._create_observador()
        self._vincular_professor_turma()
        self._ver_professor_turma()
        self._delete_observador()
        self._delete_turma()

    def test_create_search_delete_turma(self):
        self._create_turma()
        self._search_turma()
        # self._delete_turma()

    """FIM TESTE TURMA """

    """TESTE FACADE HISTORICO"""

    def _create_historico(self):
        self.facade.create_estrutura_facade("Egg", "ADMINISTRADOR")

    def _read_historico(self):
        historico = self.facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['historico'])
        self.assertIsNot(historico, [])

    def test_create_historico(self):
        self._create_aluno()

    def test_read_historico(self):
        self._read_historico()

    """FIM TESTE FACADE HISTORICO"""

    """TESTE FACADE MEDALHAS"""

    def _create_medalha(self):
        medalha = self.facade.create_estrutura_facade(tipo_estrutura='5', nome='cheese', tipo_medalha="1")
        self.assertIsNot(medalha, None)

    def _read_medalha(self):
        medalha = self.facade.read_estrutura_facade(tipo_estrutura='5')
        medalha1 = self.facade.search_estrutura_facade(tipo_estrutura='5', nome='cheese')
        self.assertIn(medalha1['id'], medalha[-1].values())

    def _delete_medalha(self):
        '''teste de inativos '''
        escolhidos = []
        for medalhas in medalhas:
            escolhidos.append(medalhas['id'])
        self.facade.delete_medalha_facade(escolhidos)

    def test_create_delete_medalha(self):
        self._create_medalha()
        # self._delete_medalha()

    def test_read_medalha(self):
        self._create_medalha()
        self._read_medalha()
        # self._delete_medalha()

    """FIM DE TESTE FACADE MEDALHAS"""

    """INICIO DE TESTE FACADE DE LOJA"""

    def _create_item(self):
        iten1 = self.facade.create_estrutura_facade(nome="burroquandofoge", tipo_estrutura=TIPO_ESTRUTURA['item'],
                                                    tipo_item=TIPO_ITEM['cor'], preco=0)
        self.assertIsNot(iten1, None)
        iten2 = self.facade.create_estrutura_facade(nome="cara de pau", tipo_estrutura=TIPO_ESTRUTURA['item'],
                                                    tipo_item=TIPO_ITEM['rosto'], preco=0)
        self.assertIsNot(iten1, None)
        iten3 = self.facade.create_estrutura_facade(nome="cauda de furry", tipo_estrutura=TIPO_ESTRUTURA['item'],
                                                    tipo_item=TIPO_ITEM['acessorio'], preco=0)
        self.assertIsNot(iten1, None)
        iten4 = self.facade.create_estrutura_facade(nome="HULK", tipo_estrutura=TIPO_ESTRUTURA['item'],
                                                    tipo_item=TIPO_ITEM['corpo'], preco=0)
        self.assertIsNot(iten1, None)

    def _read_item(self):
        self._create_item()
        item1 = self.facade.read_estrutura_facade(tipo_estrutura='4')

    def _delete_item(self):

        itens = self.facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['item'])

        escolhidos = []
        for itens in itens:
            escolhidos.append(itens['id'])
        self.facade.delete(escolhidos)

    """def test_create_delete_iten(self):
        self._create_item()
        self._delete_item()"""

    def test_read_item(self):
        self._read_item()

    """FIM DE TESTES DE ESTRUTURA FACADE"""
    """INICIO TESTE OBSERVADOR FACADE"""

    def _create_observador(self):
        observadorADM = self.facade.create_observador_facade(nome='ADMdeus', senha='span', telefone='(21)9999-9999',
                                                             cpf='123456789', email='egg@span.com.br', rede='0',
                                                             escola='0',
                                                             tipo=TIPO_USUARIOS['administrador'],
                                                             data_nascimento=date(1930, 2, 11))
        escola = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'], nome='Escola conecturma')
        self.assertIsNot(escola, None)
        turma = self.facade.search_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'], nome='Knight')
        self.assertIsNot(turma, None)

        observador_prof = self.facade.create_observador_facade(nome='Monty', senha='python',
                                                               telefone='(21)9999-9999',
                                                               cpf='123456789', email='Monty@python.com.br',
                                                               tipo='3', rede="0", escola=escola['id'],
                                                               vinculo_turma=turma['id'],data_nascimento=date(1992,10,1))
        observador_dire = self.facade.create_observador_facade(nome="diretor", senha="123", telefone="21 2569 6969",
                                                               email="tent@cool.os", tipo="2", rede='0',
                                                               escola=escola['id'],data_nascimento=date(1899,2,1))
        # observador_gestor=self.facade.create_observador_facade()
        self.assertIs(observadorADM, True)
        self.assertIs(observador_prof, True)
        self.assertIs(observador_dire, True)

    def _update_observador(self):
        observador1 = self.facade.search_observador_facade('Monty')
        observador_update = self.facade.update_observador_facade(id=observador1['id'], nome='Knight',
                                                                 telefone='(11)8888-8888', cpf='999999999',
                                                                 email='knight@ni.com', vinculo_turma="2",
                                                                 vinculo_escola="2")
        observador2 = self.facade.search_observador_tipo_nome_facade('3', 'Knight')
        self.assertEqual(observador2['nome'], 'Knight')
        self.assertEqual(observador2['telefone'], '(11)8888-8888')
        self.assertEqual(observador2['cpf'], '999999999')
        self.assertEqual(observador2['email'], 'knight@ni.com')
        self.assertEqual(observador2['vinculo_turma'], "2")
        self.assertEqual(observador2['vinculo_escola'], "2")

    def _search_observador(self):
        observador1 = self.facade.search_observador_facade('ADMdeus')
        self.assertEqual(observador1['nome'], 'ADMdeus')
        self.assertEqual(observador1['senha'], 'span')
        self.assertEqual(observador1['telefone'], '(21)9999-9999')
        self.assertEqual(observador1['cpf'], '123456789')
        self.assertEqual(observador1['email'], 'egg@span.com.br')
        self.assertEqual(observador1['tipo'], TIPO_USUARIOS['administrador'])
        observador2 = self.facade.search_observador_facade('Ni')
        self.assertIs(observador2, None)

    def _delete_observador(self):
        observador1 = self.facade.read_observador_facade()
        escolhidos = []
        for observados in observador1:
            escolhidos.append(observados['id'])
        self.facade.delete_observador_facade(escolhidos)

    def _anotacoes_estrutura(self):
        self._create_escola()
        escola = self.facade.search_estrutura_facade(tipo_estrutura="2", nome="Do bairro")
        print("L238", escola)
        mensagem2 = "Gosto dessa escola"
        mensagem = "Nossa escola deve melhorar"
        # self._create_observador()
        observador1 = self.facade.search_observador_inativos_facade("Monty")
        print("observador1 L241 , TESTE", observador1)
        gestor = self.facade.search_observador_inativos_facade("")
        self.facade.anotacoes_observador_turma_facade(escola['id'], mensagem)
        self.facade.anotacoes_observador_escola_facade(diretor1.id, mensagem2)
        self.facade.anotacoes_observador_rede_facade(gestor.id, mensagem3)
        self.assertEqual(observador1.anotacoes_estrutura_baixo[0], mensagem.encode('utf-8'))
        # self.assertEqual(gestor.anotacoes_estrutura_cima[0],mensagem2.encode('utf-8'))

    def test_create_delete_observador(self):
        self._create_observador()

    def test_create_search_delete_observador(self):
        self._create_observador()
        self._search_observador()
        self._delete_observador()

    def test_create_update_delete_observador(self):
        self._create_observador()
        self._update_observador()
        self._delete_observador()

    def _test_anotacoes(self):
        self._anotacoes_estrutura()

    """FIM TESTE OBSERVADOR"""

    """TESTE INATIVOS"""

    def _transferir_atores_inativos(self):
        self._anotacoes_no_aluno()
        # self._create_observador()
        # self._create_aluno()

        alunoer1 = self.facade.search_aluno_nome_objeto_facade(nome="egg")
        self.assertIsNot(alunoer1, None)

        aluno2 = self.facade.search_aluno_nome_objeto_facade(nome="thanos")
        self.assertIsNot(aluno2, None)

        # aluno3 = self.facade.search_aluno_nome_objeto_facade(nome="hilter")
        # self.assertIsNot(aluno3, None)

        observador1 = self.facade.search_observador_inativos_facade(nome="Monty")
        print('?',observador1.nome)
        self.assertIsNot(observador1, None)

        inativados = [alunoer1, aluno2, observador1]
        print('inativados',inativados)
        self.facade.create_zInativos_atores_facade(inativados)

        ovo_morto = self.facade.pesquisa_inativos_facade("egg")
        self.assertIsNot(ovo_morto, None)

        mensagem = "Isto é uma mensagem de teste"
        mensagem2 = "tetativa..."
        ovo_falecido = self.facade.search_aluno_nome_objeto_facade("egg")
        self.assertEqual(ovo_falecido, [])
        self.assertEqual(ovo_morto.nome, alunoer1.nome)
        self.assertEqual(ovo_morto.anotacoes_aluno[0], mensagem.encode('utf-8'))
        self.assertEqual(ovo_morto.anotacoes_aluno[1], mensagem2.encode('utf-8'))

        thanos_morto = self.facade.pesquisa_inativos_facade("thanos")
        self.assertEqual(thanos_morto.nome, aluno2.nome)
        self.assertEqual(thanos_morto.senha, aluno2.senha)
        self.assertEqual(thanos_morto.tipo_aluno, aluno2.tipo_aluno)
        self.assertEqual(thanos_morto.cor, aluno2.cor)
        self.assertEqual(thanos_morto.rosto, aluno2.rosto)
        self.assertEqual(thanos_morto.acessorio, aluno2.acessorio)
        self.assertEqual(thanos_morto.corpo, aluno2.corpo)
        self.assertEqual(thanos_morto.pontos_de_vida, aluno2.pontos_de_vida)
        self.assertEqual(thanos_morto.pontos_de_moedas, aluno2.pontos_de_moedas)
        self.assertEqual(thanos_morto.vinculo_escola, aluno2.vinculo_escola)
        self.assertEqual(thanos_morto.vinculo_turma, aluno2.vinculo_turma)
        self.assertEqual(aluno2.itens_comprados[-1], thanos_morto.itens_comprados[0])

        observador1_morto = self.facade.pesquisa_inativos_facade("Monty")
        self.assertIsNot(observador1_morto, None)
        observador1_inexistente = self.facade.search_observador_inativos_facade("Monty")
        self.assertEqual(observador1_inexistente, [])

    def _inativar_estruturas(self):
        self._create_escola()
        self.facade.search_escola_facade()
        self.facade.create_zInativos_estrutura_facade()

    def _ressuscitar_usuarios(self):
        self._transferir_atores_inativos()
        ovo_morto = self.facade.pesquisa_inativos_facade("egg")
        self.assertIsNot(ovo_morto, None)

        ovo_vivo = self.facade.reativar_usuario_facade(ovo_morto)
        self.assertEqual(ovo_vivo, True)

        fenix = self.facade.search_aluno_nome_facade("egg")
        self.assertIsNot(fenix, None)

        aluno1 = self.facade.search_aluno_nome_facade("egg")
        self.assertEqual(fenix.senha, aluno1.senha)

        cem_observador1 = self.facade.pesquisa_inativos_facade("Monty")
        self.assertIsNot(cem_observador1, None)

        observador1 = self.facade.search_observador_inativos_facade("Monty")
        self.assertIsNot(observador1, None)

        observador = self.facade.reativar_usuario_facade(cem_observador1)
        self.assertEqual(observador, True)

        cem_observador_pos = self.facade.pesquisa_inativos_facade("Monty")
        self.assertEqual(cem_observador_pos, [])

    def _read_inativados(self):
        self._transferir_atores_inativos()
        read_cem = self.facade.read_inativos_facade()
        self.assertIsNot(read_cem, None)

    def test_create_atores_inativos(self):
        self._transferir_atores_inativos()

    def _test_create_estruturas_inativas(self):
        self._inativar_estruturas()

    def test_reativar_usuario(self):
        self._ressuscitar_usuarios()

    def test_read_inativos(self):
        self._read_inativados()

    """Teste do filtro cadastro"""

    def _alunos_errados(self):
        aluno1 = self.facade.create_aluno_facade(nome='123 de oliveira 4', matricula="123424", escola='1', senha='123',
                                                 vinculo_rede='0', data_nascimento=date(1994, 3, 2), sexo='masculino')
        self.assertEqual(aluno1, False)
        aluno2 = self.facade.create_aluno_facade(nome='naotem', matricula='1234', escola='seila', senha='sdf',
                                                 vinculo_rede='0', data_nascimento=date(1999, 12, 55))

    def tearDown(self):
        self.facade.apagartudo()


if __name__ == '__main__':
    unittest.main()
