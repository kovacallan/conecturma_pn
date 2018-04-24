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
        test_app.post('/criar_rede', dict(nome_rede='cheese shop', cod='CSNI', telefone='(21) 25696969'))

    def test_create_rede(self):
        res = test_app.get('/create_rede')
        self.assertEqual(res.status_int, 200)
        self.assertIn(' <form action="/criar_rede" method="post">', res.text, res.text)
        self.assertIn('<button type="submit">Enviar</button>', res.text, res.text)

    def test_ler_redes(self):
        res = test_app.get('/read_rede')
        self.assertEqual(res.status_int, 200)
        self.assertIn(''' <td>
                            cheese shop
                        </td>''', res.text, res.text)
        self.assertIn('<form action="/turma_aluno" >', res.text, res.text)


if __name__ == '__main__':
    unittest.main()
