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

    """teste de menu(jogar_conecturma.tpl)"""

    def test_menu(self):
        res = test_app.get('/user_menu')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<a href="/mostrar_score"><button id="1" type="submit" >SCORE</button></a>', res.text, res.text)
        self.assertIn('<a id="2" href="/aluno"><button>Aluno</button>', res.text, res.text)
        self.assertIn('<a href="/turma"><button>turma</button></a>', res.text, res.text)
        self.assertIn('<a href="/loja"><button>Loja</button></a>', res.text, res.text)
        self.assertIn('<a href="/sair"><button>Sair</button></a>', res.text, res.text)
        self.assertIn('<form action="/jogos" method="get">', res.text, res.text)
        self.assertIn('Cor:', res.text, res.text)
        self.assertIn('Rosto:', res.text, res.text)
        self.assertIn('Acessorio:', res.text, res.text)
        self.assertIn('Corpo:', res.text, res.text)
        self.assertIn('<form action="/jogos" method="get">', res.text, res.text)
        self.assertIn('<form action="/jogos" method="get">', res.text, res.text)
        self.assertIn('<button type="submit" name="n1" value="j1">Jogo 1</button>', res.text, res.text)
        self.assertIn('<button type="submit" name="n1" value="j2">Jogo 2</button>', res.text, res.text)

    """teste do jogo j1(ojogo.tpl)"""

    def test_ojogo(self):
        res = test_app.get('/jogos?n1=j1')
        res1 = test_app.get('/jogos?n1=j2')
        self.assertEqual(res.status_int, 200)
        self.assertEqual(res1.status_int, 200)
        self.assertIn('<h1>Você está jogando o Jogo</h1>', res.text, res.text)
        self.assertIn('<h2>j1</h2>', res.text, res.text)
        self.assertIn('<h1>Você está jogando o Jogo</h1>', res1.text, res1.text)
        self.assertIn('<h2>j2</h2>', res1.text, res1.text)
        self.assertIn('<form action="/ponto" method="get">', res.text, res.text)
        self.assertIn('''<input type="hidden" name = "jogo" value='j1'></input>''', res.text, res.text)
        self.assertIn('<form action="/ponto" method="get">', res1.text, res1.text)
        self.assertIn('''<input type="hidden" name = "jogo" value='j2'></input>''', res1.text, res1.text)

    """Teste pagina de score(score.tpl)"""

    def test_score(self):
        res = test_app.get('/mostrar_score')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<h4>Você acertou ', res.text, res.text)


if __name__ == '__main__':
    unittest.main()
