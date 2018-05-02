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

    def _fixaluno_turma(self):
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

    """Pagina de cadastro(turma.tpl)"""
    def test_turma_inicio(self):
        res = test_app.get('/turma')
        self._fixaluno_turma()
        self.assertEqual(res.status_int, 200)
        self.assertIn('<a href="/turma_cadastro"><button>Cadastro turma</button></a>', res.text, res.text)
        self.assertIn('<a href="/turma_read"><button>Ver turma</button></a>', res.text, res.text)
        self.assertIn('<a href="/user_menu"><button>Voltar</button></a>', res.text, res.text)
        test_app.post('/cadastro_turma', dict(turma_nome='ni'))
    """teste de cadastro turma(turma_cadastro.tpl)"""
    def test_cadastro_turma(self):
        test_app.post('/cadastro_turma', dict(turma_nome='parrot'))
        res = test_app.get('/turma_cadastro')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/cadastro_turma" method="post">', res.text, res.text)
        self.assertIn('<button type="submit">Enviar</button>', res.text, res.text)

    "Teste de ler turma(turma_read.tpl)"
    def test_ler_turma(self):
        test_app.post('/cadastro_turma', dict(turma_nome='ni'))
        res = test_app.get('/turma_read')
        self.assertEqual(res.status_int, 200)
        self.assertIn(''' ni''',res.text,res.text)
        self.assertIn('''eric''',res.text,res.text)
        self.assertIn('<a href="/turma"><button>Voltar</button></a>',res.text,res.text)

test_app.reset()
if __name__ == '__main__':
    unittest.main()
