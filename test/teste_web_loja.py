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


    def _fixloja(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res1= test_app.post('/cadastro_item' , dict(nome='knight', preco= 5 , tipo=2 ))

    def loja_inicial(self):
        self._fixloja()
        res = test_app.get('/loja')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/compras_loja">', res.text, res.text)
        self



if __name__ == '__main__':
    unittest.main()