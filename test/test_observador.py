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

    def _fixobservador(self):
        res = test_app.post('/observador/cadastro', nome='parrot', senha='123', telefone='(21)25696969',
                            cpf='159852654-82', email='adm@adm.adm.br1', tipo=0)
        res2 = test_app.post('/observador/cadastro', nome='parrot', senha='123', telefone='(21)25696969',
                            cpf='149852654-82', email='adm@adm.adm.br1', tipo=0)
    def test_teste(self):
        self._fixobservador

if __name__ == '__main__':
    unittest.main()
