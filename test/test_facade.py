# coding: utf-8
import unittest

from src.facade.facade_main import Facade
from control.dicionarios import TIPO_ESTRUTURA, TIPO_USUARIOS

facade = Facade()


class FacadeTest(unittest.TestCase):
    def setUp(self):
        self.facade = Facade()

    """TESTE ALUNO"""

    def _create_aluno(self):

        aluno1 = self.facade.create_aluno_facade(nome="egg", vinculo_escola="Escola Conecturma", matricula="123",
                                                 vinculo_rede="0")
        espero_aluno = self.facade.search_aluno_id_facade(1)
        self.assertIsNotNone(espero_aluno)
        # self.assertEqual(aluno1, True)
        aluno2 = self.facade.create_aluno_facade(nome="dickens silverio", matricula="matri", nome_login="dickens",
                                                 senha="abcd", email="henrique_boladao@bol.com", tipo_aluno="6",
                                                 cpf_responsavel="123594847-42", vinculo_rede="Rede Conecturma",
                                                 vinculo_escola="Escola Conecturma", vinculo_serie="1o ano")
        # self.assertEqual(aluno2, True)
        aluno3 = self.facade.create_aluno_facade(nome='silvio_santos', matricula='23451', nome_login='silvio',
                                                 vinculo_rede="Rede Conecturma", vinculo_turma='KND')
        # self.assertEqual(aluno3, True)
        aluno4 = self.facade.create_aluno_facade(nome='patric_estrela', matricula='23451', nome_login='patrick',
                                                 vinculo_turma='KND')
        # self.assertEqual(aluno4, True)

    def test_create_aluno(self):
        self._create_aluno()

    def _read_aluno(self):
        self._create_aluno()
        for i in range(0, len(self.facade.read_aluno_facade())):
            if self.facade.read_aluno_facade()[i]['id'] == 1:
                self.assertEqual(self.facade.read_aluno_facade()[i]['nome'], 'egg')
            elif self.facade.read_aluno_facade()[i]['id'] == 2:
                self.assertEqual(self.facade.read_aluno_facade()[i]['nome'], 'dickens silverio')
            elif self.facade.read_aluno_facade()[i]['id'] == 3:
                self.assertEqual(self.facade.read_aluno_facade()[i]['nome'], 'silvio_santos')
            elif self.facade.read_aluno_facade()[i]['id'] == 4:
                self.assertEqual(self.facade.read_aluno_facade()[i]['nome'], 'patric_estrela')

    def test_read_aluno(self):
        self._read_aluno()

    def _update_aluno(self):
        self._create_aluno()
        aluno1 = self.facade.search_aluno_nome_facade("dickens silverio")
        self.facade.update_aluno_facade(aluno1['id'], "knight", senha="321", turma="do bairro", escola="conectreutrma",
                                        rede="de pesca")
        aluno2 = self.facade.search_aluno_nome_facade("knight")
        self.assertEqual(aluno1['id'], aluno2['id'])
        self.assertNotEqual(aluno1['nome'], aluno2['nome'])
        self.assertNotEqual('dickens silverio', aluno2['nome'])
        self.assertEqual(aluno2['senha'], '321')

    def test_update_aluno(self):
        self._update_aluno()

    def _search_aluno_id_facade(self):
        self._create_aluno()
        aluno = self.facade.search_aluno_id_facade('1')
        self.assertEqual(aluno['nome'], 'egg')
        self.assertEqual(aluno['vinculo_escola'], 'Escola Conecturma')

    def test_pesquisa_aluno_id(self):
        self._search_aluno_id_facade()

    def _search_aluno_escola_facade(self):
        self._create_aluno()
        aluno = self.facade.search_aluno_escola_facade('Escola Conecturma')
        self.assertEqual(aluno[0]['nome'], 'dickens silverio')

    def test_search_aluno_escola(self):
        self._search_aluno_escola_facade()

    def _pesquisa_aluno(self):
        self._create_aluno()
        aluno = self.facade.search_aluno_nome_facade("egg")
        self.assertEqual(aluno['matricula'], '123')
        aluno1 = self.facade.search_aluno_nome_facade("dickens silverio")
        self.assertEqual(aluno1['email'], 'henrique_boladao@bol.com')

    def test_pesquisa_aluno(self):
        self._pesquisa_aluno()

    def _alun_pesquisa_login(self):
        self._create_aluno()
        aluno = self.facade.search_aluno_nome_login_facade('dickens')
        self.assertEqual(aluno['matricula'], 'matri')
        self.assertEqual(aluno['nome'], 'dickens silverio')
        self.assertEqual(aluno['email'], 'henrique_boladao@bol.com')

    def test_pesquisa_login(self):
        self._alun_pesquisa_login()

    def _pesq_alun_obj(self):
        self._create_aluno()
        alun = self.facade.search_aluno_nome_objeto_facade('dickens silverio')
        self.assertIsNotNone(alun.id)
        self.assertIsNotNone(alun.nome)
        self.assertIsNotNone(alun.senha)

    def test_pes_obj_alun(self):
        self._pesq_alun_obj()

    def _aluno_in_turma(self):
        self._create_turma()
        aluno1 = self.facade.create_aluno_facade(matricula="0", nome="egg", escola="Escola Conecturma", senha="123",
                                                 vinculo_rede='0')
        alunoer1 = self.facade.search_aluno_nome_facade("egg")
        self.facade.create_aluno_facade(nome="Ni", senha="123", escola="Escola Conecturma", rede="0")
        aluno2 = self.facade.search_aluno_nome_facade("Ni")
        escolhidos = [alunoer1['id'], aluno2['id']]
        turma1 = self.facade.search_estrutura_facade("3", "Knight")
        self.facade.aluno_in_turma_facade(escolhidos, turma1['id'])
        aluntest2 = self.facade.search_aluno_nome_facade('Ni')
        aluntest = self.facade.search_aluno_nome_facade('egg')
        self.assertEqual(aluntest['vinculo_turma'], str(turma1['id']))
        self.assertEqual(aluntest2['vinculo_turma'], str(turma1['id']))

    def test_aluno_in_turma(self):
        self._aluno_in_turma()

    def _comprar_item(self):
        self._create_item()
        self._create_aluno()
        aluno1 = self.facade.search_aluno_nome_objeto_facade("egg")
        item1 = self.facade.search_estrutura_facade(nome="burroquandofoge", tipo_estrutura="4")

        self.facade.compra_item_facade(aluno1.id, item1['id'])
        self.assertIn(str(item1['id']), aluno1.itens_comprados[-1].decode('utf-8'))

    def test_compra_item(self):
        self._comprar_item()

    def _ver_iten_comprado(self):
        self._comprar_item()
        aluno1 = self.facade.search_aluno_nome_objeto_facade("egg")
        iten = self.facade.ver_item_comprado_facade(aluno1.id)
        self.assertEqual([(aluno1.itens_comprados[0].decode('utf-8'))], iten)

    def test_ver_itens_comprados(self):
        self._ver_iten_comprado()

    def _equipar_item_facade(self):
        self._comprar_item()
        aluno1 = self.facade.search_aluno_nome_facade("egg")
        iten = self.facade.search_estrutura_facade(tipo_estrutura='5', nome="burroquandofoge")
        self.facade.equipar_item_facade(aluno1['id'], iten)
        aluno2 = self.facade.search_aluno_nome_facade("egg")
        self.assertEqual(aluno2['cor'], str(iten['id']))

    def test_equipar_item(self):
        self._equipar_item_facade()

    def _mostrar_avatar(self):
        self._equipar_item_facade()
        aluno1 = self.facade.search_aluno_nome_facade("egg")
        self.facade.avatar_facade(aluno1['id'])
        iten1 = self.facade.search_estrutura_facade(TIPO_ESTRUTURA['item'], "burroquandofoge")
        self.assertEqual(self.facade.avatar_facade(aluno1['id'])['cor'], str(iten1['id']))
        # self._delete_item()

    def test_ver_avatar(self):
        self._mostrar_avatar()

    def _anotacoes_no_aluno(self):
        self._create_aluno()
        mensagem2 = "tetativa..."
        mensagem = "Isto é uma mensagem de teste"
        aluno1 = self.facade.search_aluno_nome_objeto_facade("egg")
        self.facade.anotacoes_aluno_facade(aluno1.id, mensagem)
        self.facade.anotacoes_aluno_facade(aluno1.id, mensagem2)
        self.assertEqual(aluno1.anotacoes_aluno[0], mensagem.encode('utf-8'))
        self.assertEqual(aluno1.anotacoes_aluno[1], mensagem2.encode('utf-8'))

    def test_anotacoes_no_aluno(self):
        self._create_aluno()
        self._anotacoes_no_aluno()

    def _read_anotacoes_no_aluno(self):
        self._anotacoes_no_aluno()
        aluno1 = self.facade.search_aluno_nome_facade("egg")
        read = self.facade.read_anotacoes_aluno_facade(aluno1['id'])
        self.assertIn("Isto é uma mensagem de teste", read)

    def test_read_anotacoes_aluno(self):
        self._read_anotacoes_no_aluno()

    def _pes_alun_by_rede(self):
        self._create_aluno()
        alun_rede = self.facade.search_aluno_by_rede_facade('Rede Conecturma')
        self.assertIsNotNone(alun_rede)
        self.assertEqual(alun_rede[0]['nome'], 'dickens silverio')
        self.assertEqual(alun_rede[1]['nome'], 'silvio_santos')

    def test_pes_alun_rede(self):
        self._pes_alun_by_rede()

    def _pes_alun_by_turma(self):
        self._create_aluno()
        alunos = self.facade.search_aluno_by_turma_facade('KND')
        self.assertEqual(alunos[0]['nome'], 'patric_estrela')
        self.assertEqual(alunos[1]['nome'], 'silvio_santos')

    def test_pesq_alun_t(self):
        self._pes_alun_by_turma()

    def _gravar_premiacao(self):
        # premios = {
        #     'medalhas': gamificacao_medalha(aluno, oa=oa),
        #     'moedas': gamificacao['moedas'],'''int'''
        #     'xp': gamificacao['xp'] '''int'''
        # }
        medalhas = ('1', '2', '3')
        premiacao = {
            'medalhas': medalhas,
            'moedas': 9,
            'xp': 10
        }
        self.facade.gravar_premiacao(1, premiacao)
        aluno = self.facade.search_aluno_id_facade(1)
        self.assertEqual(aluno['pontos_de_vida'], '10')
        self.assertEqual(aluno['pontos_de_moedas'], '9')
        medalha = self.facade.get_medalhas_facade(1)
        self.assertEqual(medalha[0], '1')
        self.assertEqual(medalhas[1], '2')
        self.assertEqual(medalhas[2], '3')

    def test_gravar_premiacao(self):
        self._create_aluno()
        self._gravar_premiacao()

    def _armazenar_ultimo_jogo(self):
        self._create_aluno()
        self.facade.armazenar_ultimo_jogo_jogado(1)

    def _test_all_aluno(self):
        pass

    """FIM TESTE USUARIO/ALUNO"""

    """INICIO TESTE OBSERVADOR"""

    def _create_observador(self):
        observador1 = self.facade.create_observador_facade(nome='Egg', senha='span', telefone='(21)9999-9999',
                                                           cpf='123456789', email='egg@span.com.br', rede='Rede Conecturma', escola='0',
                                                           tipo=TIPO_USUARIOS['administrador'])

        existe = self.facade.search_observador_id_facade(1)
        self.assertIsNotNone(existe)
        observador2 = self.facade.create_observador_facade(nome='Monty', senha='python',
                                                           telefone='(21)9999-9999',
                                                           cpf='123456789', email='Monty@python.com.br',
                                                           tipo=TIPO_USUARIOS['gestor'], rede="Nenhuma", escola="1",
                                                           vinculo_turma="1")
        self.assertIs(observador2, True)

        observador3 = self.facade.create_observador_facade(nome="diretor", senha="123", telefone="21 2569 6969",
                                                           email="tent@cool.os", tipo=TIPO_USUARIOS['diretor'],
                                                           rede="nao", escola='0')

        self.assertEqual(observador3, True)

        observador4 = self.facade.create_observador_facade(nome='Caio Lacildes', senha='123deoliveira4',
                                                           telefone='22001593', tipo=TIPO_USUARIOS['professor'],
                                                           escola='Fundaçao zeraldo oliveira',
                                                           vinculo_turma='TURMA DO BAIRRO', cpf='2015647892',
                                                           rede='Rede de pesca', email='seil@teste.br')
        self.assertEqual(observador4, True)

    def _update_observador(self):
        observador1 = self.facade.search_observador_facade('Monty')
        self.facade.update_observador_facade(id=observador1['id'], nome='Knight',
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

    def test_create_update_delete_observador(self):
        self._create_observador()
        self._update_observador()
        self._delete_observador()

    def _read_observador(self):
        self._create_observador()
        observador1 = self.facade.search_observador_facade('Egg')
        observador2 = self.facade.search_observador_facade('Monty')
        observador3 = self.facade.search_observador_facade('diretor')
        observador4 = self.facade.search_observador_facade('Caio Lacildes')
        observador = self.facade.read_observador_facade()
        x=0
        for i in range(0, len(observador)):
            if self.facade.read_observador_facade()[i]['nome'] == 'Egg':
                self.assertEqual(observador[i]['email'],observador1['email'])
                self.assertEqual(observador[i]['telefone'], observador1['telefone'])
            elif self.facade.read_observador_facade()[i]['nome'] == 'Monty':
                self.assertEqual(self.facade.read_observador_facade()[i]['email'], observador2['email'])
            elif observador[i]['nome'] == observador3['nome']:
                self.assertEqual(observador[i]['email'],observador3['email'])
            elif observador[i]['nome'] == observador4['nome']:
                self.assertEqual(observador[i]['email'], observador4['email'])
            x += 1
        self.assertEqual(x,len(observador))

    def test_read_observador(self):
        self._read_observador()

    def _redefinir_senha(self):
        self._create_observador()
        observador=self.facade.search_observador_facade('Egg')
        self.facade.redefinir_senha_facade(observador['id'],'naoseimesmo')
        observador_pos=self.facade.search_observador_facade('Egg')
        self.assertEqual(observador['id'],observador_pos['id'])
        self.assertNotEqual(observador['senha'], observador_pos['senha'])
        self.assertEqual(observador_pos['senha'],'naoseimesmo')

    def test_redefinir_senha(self):
        self._redefinir_senha()

    def _search_observador_id(self):
        self._create_observador()
        observador=self.facade.search_observador_id_facade(1)
        self.assertEqual(observador.nome,'Egg')
        self.assertNotEqual(observador.nome, 'egg')
        observador2 = self.facade.search_observador_id_facade(2)
        self.assertEqual(observador2.nome,'Monty')
        self.assertNotEqual(observador2.nome, 'monty')

    def test_search_observador_id(self):
        self._search_observador_id()

    def _search_observador_email(self):
        self._create_observador()
        observador=self.facade.search_observador_id_facade(1)
        observador1=self.facade.search_observador_email_facade(observador.email,)
        self.assertEqual(observador.nome,observador1['nome'])
        self.assertEqual(observador.email, observador1['email'])
        self.assertEqual(observador.senha, observador1['senha'])
        self.assertEqual(observador.telefone, observador1['telefone'])

    def test_search_observador_email(self):
        self._search_observador_email()

    def _search_observador(self):
        self._create_observador()
        observador1 = self.facade.search_observador_facade('Egg')
        self.assertEqual(observador1['nome'], 'Egg')
        self.assertEqual(observador1['senha'], 'span')
        self.assertEqual(observador1['telefone'], '(21)9999-9999')
        self.assertEqual(observador1['cpf'], '123456789')
        self.assertEqual(observador1['email'], 'egg@span.com.br')
        self.assertEqual(observador1['tipo'], '0')
        observador2 = self.facade.search_observador_facade('Ni')
        self.assertIs(observador2, None)

    def test_search_obs(self):
        self._search_observador()

    def _search_observador_tipo(self):
        self._create_observador()
        observador_adm=self.facade.search_observador_tipo_facade(TIPO_USUARIOS['administrador'])
        self.assertEqual(observador_adm[0]['nome'],'Egg')
        observador_gestor=self.facade.search_observador_tipo_facade(TIPO_USUARIOS['gestor'])
        self.assertEqual(observador_gestor[0]['nome'],'Monty')
        observador_diretor=self.facade.search_observador_tipo_facade(TIPO_USUARIOS['diretor'])
        self.assertEqual(observador_diretor[0]['nome'],'diretor')
        observador_professor=self.facade.search_observador_tipo_facade(TIPO_USUARIOS['professor'])
        self.assertEqual(observador_professor[0]['nome'],'Caio Lacildes')

    def test_search_observador_tipo(self):
        self._search_observador_tipo()

    def _search_observador_tipo_nome(self):
        observador1=self.facade.search_observador_tipo_nome_facade(TIPO_USUARIOS['administrador'],'Egg')
        observador1_1=self.facade.search_observador_facade('Egg')
        self.assertEqual(observador1,observador1_1)

    def test_search_observador_tipo_nome(self):
        self._search_observador_tipo_nome()

    def _search_obsevador_by_rede(self):
        self._create_observador()
        observador1= self.facade.search_observador_id_facade(1)
        observador_rede1= self.facade.search_observador_by_rede_facade("Rede Conecturma")
        self.assertEqual(observador_rede1[0]['nome'],observador1.nome)
        observador2 = self.facade.search_observador_id_facade(2)
        observador_rede2 = self.facade.search_observador_by_rede_facade("Nenhuma")
        self.assertEqual(observador2.nome,observador_rede2[0]['nome'])
        observador3= self.facade.search_observador_id_facade(3)
        observador_rede3=self.facade.search_observador_by_rede_facade("nao")
        self.assertEqual(observador3.nome,observador_rede3[0]['nome'])

    def test_search_observador_by_rede(self):
        self._search_obsevador_by_rede()

    def _search_observador_escola(self):
        self._create_observador()
        observador1=self.facade.search_observador_escola()

    def _delete_observador(self):
        observador1 = self.facade.read_observador_facade()
        escolhidos = []
        for observados in observador1:
            escolhidos.append(observados['id'])
        self.facade.delete_observador_facade(escolhidos)

    def _anotacoes_estrutura(self):
        self._create_escola()
        self._pesquisa_escola()
        mensagem2 = "Gosto dessa escola"
        mensagem = "Nossa escola deve melhorar"
        observador1 = self.facade.search_observador_inativos_facade("egg")
        gestor = self.facade.search_observador_inativos_facade("")
        self.facade.anotacoes_estrutura_baixo_facade(observador1.id, mensagem)
        self.facade.anotacoes_estrutura_cima_facade(gestor.id, mensagem2)
        self.assertEqual(observador1.anotacoes_estrutura_baixo[0], mensagem.encode('utf-8'))
        # self.assertEqual(gestor.anotacoes_estrutura_cima[0],mensagem2.encode('utf-8'))

    def _test_anotacoes(self):
        self._anotacoes_estrutura()

    """FIM TESTE OBSERVADOR"""

    """TESTE REDE"""

    def _create_rede(self):
        rede = self.facade.create_estrutura_facade(tipo_estrutura='1', nome="egg", telefone="(21)9999-9999")
        rede2 = self.facade.search_estrutura_facade("1", "egg")
        self.assertIsNot(rede, None)
        self.assertIsNot(rede2, None)

    def _update_rede(self):
        rede = self.facade.create_estrutura_facade(nome="egg", telefone="(21)9999-9999")
        self.assertIsNot(rede, None)
        rede1 = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="egg")
        self.assertIsNot(rede1, None)

        rede_up = self.facade.update_estrutura_facade(rede.id, nome="Ni", telefone="(11)8888-8888")
        rede = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="Ni")
        self.assertEqual(rede['nome'], "Ni")
        self.assertEqual(rede['telefone'], "(11)8888-8888")

    def _pesquisa_rede(self):
        rede = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="Ni")
        self.assertIs(rede, rede)
        rede1 = self.facade.search_estrutura_facade(tipo_estrutura="1", nome="Sily walk")
        self.assertIs(rede1, None)

    def _delete_rede(self):
        rede = self.facade.read_estrutura_facade(tipo_estrutura="1")
        escolhidos = []
        for redes in rede:
            escolhidos.append(redes['id'])
        self.facade.delete_rede_facade(escolhidos)

    def test_create_rede(self):
        self._create_rede()

    def test_update_rede(self):
        self._update_rede()

    def _test_pesquisa_rede(self):
        self._pesquisa_rede()

    def _test_delete_rede(self):
        self._update_rede()
        self._delete_rede()

    """FIM TESTE REDE"""

    """TESTE FACADE ESCOLA"""

    def _create_escola(self):
        escola = self.facade.create_estrutura_facade(nome='Do bairro', bairro='de baixo', telefone='2266 6622',
                                                     numero='21 ', UF='RJ', cidade='Pindamonhagaba',
                                                     cep='22287111')
        self.assertIsNot(escola, None)

    def _update_escola(self):
        escola = self.facade.search_escola_facade("Do bairro")
        self.facade.update_escola_facade(escola['id'], nome="Ni", telefone="33355567", vinculo_rede="abelhinha",
                                         cep="22270 999", endereco="rua do teste ", numero='666',
                                         cidade="RIO DE JANEIRO",
                                         estado='RJ')
        escola2 = self.facade.search_escola_facade("Ni")
        self.assertEqual(escola2['nome'], "Ni")
        self.assertEqual(escola2['endereco'], "rua do teste ")
        self.assertEqual(escola2['numero'], '666')
        self.assertEqual(escola2['vinculo_rede'], "abelhinha")
        self.assertEqual(escola2['telefone'], "33355567")

    def _pesquisa_escola(self):
        escola = self.facade.search_estrutura_facade(tipo_estrutura="2", nome="Do bairro")
        self.assertIs(escola, escola)
        escola1 = self.facade.search_estrutura_facade(tipo_estrutura="2", nome="Sily walk")
        self.assertIs(escola1, {})

    def _test_create_delete_escola(self):
        self._create_escola()

    def _test_pesquisa_escola(self):
        self._create_escola()
        self._pesquisa_escola()

    def _test_update_escola(self):
        self._create_escola()
        self._update_escola()

    """FIM TESTE ESCOLA"""
    """TESTE TURMA"""

    def _create_turma(self):
        turma1 = self.facade.create_estrutura_facade(nome="Knight", tipo_estrutura="3", serie="1", vinculo_escola="1",
                                                     quem_criou="Ni")
        self.assertIsNot(turma1, None)

    def _search_turma(self):
        turma1 = self.facade.search_estrutura_facade(tipo_estrutura="3", nome="Knight")
        self.assertIn(turma1['nome'], "Knight")
        self.assertIn(turma1['quem_criou'], "Ni")

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

    def test_create_delete_turma(self):
        self._create_turma()

    def _test_vincular_professor_turma(self):
        self._create_turma()
        self._create_observador()
        self._vincular_professor_turma()
        self._ver_professor_turma()
        self._delete_observador()

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
        iten1 = self.facade.create_estrutura_facade(nome="burroquandofoge", tipo_estrutura='4', tipo_item='1', preco=0)
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

    """TESTE INATIVOS"""

    def _transferir_atores_inativos(self):
        self._anotacoes_no_aluno()
        self._create_observador()

        # iten1 = self.facade.create_estrutura_facade(nome="burroquandofoge", '1', preco=0)
        # self.assertIsNot(iten1, None)

        aluno1 = self.facade.create_aluno_facade(nome="thanos", escola="Estalo", senha="123", vinculo_rede="0",
                                                 matricula='2929')
        # item2 = self.facade.search_estrutura_facade("burroquandofoge")
        self.assertEqual(aluno1, True)
        # self.assertIsNot(item2,None)

        alunoer1 = self.facade.search_aluno_nome_objeto_facade("egg")
        self.assertIsNot(alunoer1, None)

        aluno2 = self.facade.search_aluno_nome_objeto_facade("thanos")
        self.assertIsNot(aluno2, None)

        aluno2_pos = self.facade.search_aluno_nome_objeto_facade("thanos")
        self.assertIsNot(aluno2_pos, None)

        observador1 = self.facade.search_observador_inativos_facade("Monty")
        self.assertIsNot(observador1, None)

        inativados = [alunoer1, aluno2_pos, observador1]
        self.facade.create_zInativos_atores_facade(inativados)

        ovo_morto = self.facade.pesquisa_inativos_facade("egg")
        self.assertIsNot(ovo_morto, None)

        mensagem = "Isto é uma mensagem de teste"
        mensagem2 = "tetativa..."
        ovo_falecido = self.facade.pesquisa_aluno_nome_objeto_facade("egg")
        self.assertEqual(ovo_falecido, [])
        self.assertEqual(ovo_morto.nome, alunoer1.nome)
        self.assertEqual(ovo_morto.anotacoes_aluno[0], mensagem.encode('utf-8'))
        self.assertEqual(ovo_morto.anotacoes_aluno[1], mensagem2.encode('utf-8'))

        thanos_morto = self.facade.pesquisa_inativos_facade("thanos")
        self.assertEqual(thanos_morto.nome, aluno2_pos.nome)
        self.assertEqual(thanos_morto.senha, aluno2_pos.senha)
        self.assertEqual(thanos_morto.tipo_usuario, aluno2_pos.tipo_aluno)
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

    def _test_create_atores_inativos(self):
        self._transferir_atores_inativos()

    def _test_create_estruturas_inativas(self):
        self._inativar_estruturas()

    def _test_reativar_usuario(self):
        self._ressuscitar_usuarios()

    def _test_read_inativos(self):
        self._read_inativados()

    def tearDown(self):
        self.facade.apagartudo()

    # def test_substituto_de_webtest(self):
    #     self._create_observador()


if __name__ == '__main__':
    unittest.main()
