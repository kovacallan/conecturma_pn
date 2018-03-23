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

    """Pagina de cadastro(formulario_cadastro.tpl)"""
    def test_turma_inicio(self):
        res = test_app.get('/turma')
        self._fixaluno_turma()
        self.assertEqual(res.status_int, 200)
        self.assertIn('<a href="/turma_cadastro"><button>Cadastro turma</button></a>', res.text, res.text)
        self.assertIn('<a href="/turma_read"><button>Ver turma</button></a>', res.text, res.text)
        self.assertIn('<a href="/user_menu"><button>Voltar</button></a>', res.text, res.text)



