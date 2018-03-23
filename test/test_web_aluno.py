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
        test_app.post('/aluno_cadastro', dict(aluno_nome='eric', senha='idle'))
        test_app.post('/login', dict(usuario='eric', senha='idle'))

    def _fixaluno(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res2 = test_app.get('/turma_cadastro', dict(turma_nome='ni'))
        res3 = test_app.get('/turma_cadastro', dict(turma_nome='parrot'))
        # res4 = test_app.get('/cadastro_item' , dict(nome='burro quando foge',tipo='3',preco='5'))

    def _test_index(self):
        """ o indice desse servidor """
        res = test_app.get('/')
        self.assertEqual(res.status_int, 200)
        self.assertIn('name="usuario"', res.text, res.text)
        # self.assertEqual(res.json['upper_query'], 'FOO')

        """ INICIO TESTE PASTA ALUNO"""

    """Pagina aluno.tpl"""

    def test_aluno_inicio(self):
        res = test_app.get('/aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/cadastro_aluno">
            <button>criar aluno</button>
            </a>''', res.text, res.text)
        self.assertIn('''<a href="/ler_aluno">
            <button>ver alunos</button>
            </a>''', res.text, res.text)
        self.assertIn('''<a href="/ver_itens_comprados">
            <button>Ver Itens Comprados</button>
            </a>''', res.text, res.text)
        self.assertIn('''<a href="/user_menu">
            <button>Voltar</button>
            </a>''', res.text, res.text)

    """Pagina aluno cadastro(aluno_cadastro.tpl)"""

    def test_aluno_cadastro(self):
        res = test_app.get('/cadastro_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/aluno_cadastro" method="post">', res.text)
        self.assertIn('''<button type="submit">Enviar</button>
        </form>''', res.text, res.text)
        self.assertIn('''<a href="/aluno"><button>Voltar</button></a>''', res.text)

    """Teste ler aluno(aluno_read.tpl"""

    def test_read_student(self):
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

    def test_read_itens(self):
        pass

        """FINAL DE TEST DA PASTA ALUNO"""

        """INICIO DE TEST DA PASTA TURMA"""

    """Pagina turma.tpl"""

    def _test_turma_inicio(self):
        self.assertIn('<a href="/turma_cadastro"><button>Cadastro turma</button></a>', res.text, res.text)


    def test_jogo(self):
        self._fixaluno()
        res = test_app.get("/jogos?n1=j1")
        res = test_app.get("/jogos?n1=j2")
        # res1 = test_follow.follow()
        self.assertEqual(res.status_int, 200)
        self.assertIn(' <form action="/ponto" method="get">', res.text, res.text)

    def test_score_coins_lifes(self):
        """A pagina de Score deve mostrar a pontuaçao de J1 , J2 , Moedas , Vidas e desempenho do aluno em cada jogo"""
        res = test_app.get('/mostrar_score')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<h4>Você acertou', res.text)
        self.assertIn('    <h3>J2</h3>', res.text)
        self.assertIn('<h4>Você acertou ', res.text)
        self.assertIn('<h3>Vidas</h3>', res.text)

    def _test_alun_in_turma(self):
        self._fixaluno()
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<input type="checkbox" name="aluno''', res.text, res.text)
        self.assertIn("egg</input>", res.text, res.text)
        self.assertIn("<option value=", res.text, res.text)

    def test_del_alunos(self):
        res = test_app.get('/ler_aluno')
        self.assertIn(
            '<button type="submit" name ="deletar_estudantes" formaction="/deletar_alunos">deletar alunos selecionados</button>',
            res.text,
            res.text)

    def ver_itens(self):
        res = test_app.get('/ver_itens_comprados')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/equipar_item" method="post">')

    def _test_butoes(self):
        res = test_app.get('/user_menu')
        test_response.click(description='<a id="2" href="/aluno"><button>Aluno</button></a>', linkid="2",
                            href="/aluno", verbose=True)


test_app.reset()
if __name__ == '__main__':
    unittest.main()
