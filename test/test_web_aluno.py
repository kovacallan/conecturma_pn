from index import application
import unittest
from webtest import TestApp, TestResponse
import sys
from http.cookiejar import CookieJar

test_app = TestApp(application, cookiejar=CookieJar())
test_response = TestResponse()

sys.path.append('../')


# os.environ['WEBTEST_TARGET_URL'] = 'http://localhost:8888'

# test_app.set_cookie('login', '2524')
# test_app.authorization()


class BlackBoxTest(unittest.TestCase):
    def setUp(self):
        # test_app.post('/escola/create_escola', dict(nome="Escola Conecturma",                                                                         telefone="21 99445732", cep=""))
        test_app.post('/aluno_cadastro', dict(aluno_nome='eric', escola="2", senha='idle'))
        test_app.post('/login_aluno', dict(usuario='eric', senha='idle'))

    def _fixaluno(self):

        # res2 = test_app.post('/turma_cadastro', dict(turma_nome='ni'))
        # res3 = test_app.post('/turma_cadastro', dict(turma_nome='parrot'))
        res4 = test_app.post('/cadastro_item' , dict(nome='burro quando foge',tipo='3',preco='0'))

    def _test_index(self):
        """ o indice desse servidor """
        res = test_app.get('/aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('name="usuario"', res.text, res.text)
        # self.assertEqual(res.json['upper_query'], 'FOO')

        """ INICIO TESTE PASTA ALUNO"""

    """Pagina aluno.tpl"""

    def test_aluno_inicio(self):
        res = test_app.get('/jogar_conecturma')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<form action="/jogos" method="get">''', res.text, res.text)
        self.assertIn('''<a href="/loja"><button>Loja</button></a>''', res.text, res.text)
        self.assertIn('''<a href="/aluno/ver_itens_comprados"><button>Ver Itens</button></a>''', res.text, res.text)
        self.assertIn('''<a href="/sair"><button>Sair</button></a>''', res.text, res.text)

    def test_acesso_loja(self):
        self._fixaluno()
        res= test_app.get('/loja')
        self.assertEqual(res.status_int,200)
        self.assertIn('<form action="/compras_loja">', res.text, res.text)
        self.assertIn('''<button type="submit" name="id" value=''', res.text, res.text)
        self.assertIn('''Comprar</button>''',res.text,res.text)

    def test_ver_itens(self):
        res= test_app.get('/aluno/ver_itens_comprados')
        self.assertEqual(res.status_int, 200)
        # self.assertIn('<form action="/equipar_item" method="post">', res.text, res.text)
        self.assertIn('<a href="/aluno"><button>Voltar</button></a>', res.text, res.text)

    def _test_ler_aluno(self):
        res = test_app.get('/aluno/ler_aluno')
        self.assertEqual(res.status_int, 200)


    """Pagina aluno cadastro(aluno_cadastro.tpl)"""

    def _test_aluno_cadastro(self):
        res = test_app.get('/formulario_cadastro')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/cadastro" method="post">', res.text,res.text)
        self.assertIn('''<button type="submit">Enviar</button>
        </form>''', res.text, res.text)
        self.assertIn('''<a href="/"><button>Voltar</button></a>''', res.text)

    """Teste ler aluno(aluno_read.tpl"""

    def _test_read_student(self):
        """ A página dos alunos deve permitir deletar aluno. """
        self._fixaluno()
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn(
            '<button type="submit" name ="deletar_estudantes" formaction="/deletar_alunos">deletar alunos selecionados</button>',
            res.text, res.text)
        self.assertIn('<form action="/turma_aluno" >', res.text, res.text)
        self.assertIn('<input type="checkbox" name="aluno_', res.text, res.text)
        self.assertIn('egg', res.text, res.text)
        self.assertIn('ni', res.text, res.text)
        self.assertIn(
            '<button type="submit" name ="deletar_estudantes" formaction="/deletar_alunos">deletar alunos selecionados</button>'
            , res.text, res.text)
        self.assertIn("egg</input>", res.text, res.text)
        # self.assertIn("<option value=", res.text, res.text) nao ve

    """Pagina de ler itens(view_itens.tpl)"""

    def _test_read_itens(self):
        pass

        """FINAL DE TEST DA PASTA ALUNO"""

        """INICIO DE TEST DE PASTA TURMA"""
    """testa todos os camihos de butoes referentes a aluno"""
    def _test_butoes(self):
        res = test_app.get('/user_menu')
        test_response.click(description='<a id="2" href="/aluno"><button>Aluno</button></a>', linkid="2",
                            href="/aluno", verbose=True)
    def _test_mudar_senha(self):
        res = test_app.get('/new_senha')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/new_senha" method="post">')





test_app.reset()
if __name__ == '__main__':
    unittest.main()
