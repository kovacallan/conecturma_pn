from index import application
import unittest
from webtest import TestApp, TestResponse
import sys
from http.cookiejar import CookieJar

test_app = TestApp(application, cookiejar=CookieJar())
test_response = TestResponse()
sys.path.append('../')


class MyTestCase(unittest.TestCase):
    def setUp(self):
        # test_app.post('/login_observador',dict(usuario= 'administrator', senha="@onde2929"))
        test_app.post('/observador/create_observador_diretor',
                      dict(nome='dir', senha="quero", telefone="21 99887342", cpf="98536161",
                           email="teste@teste.test.te", tipo_observador="2", escola="1", rede='0'))
        test_app.post('/login_observador', dict(usuario='dir', senha='quero'))

    def test_inicial(self):
        res = test_app.get('/gestao_aprendizagem')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/turma">TURMA</a><br>''',res.text,res.text)
        self.assertIn(''' <a href="/usuario">USUÁRIOS</a><br>''',res.text,res.text)
        self.assertIn('''<h2>Bem Vindo dir </h2>''',res.text,res.text)

    def test_turma(self):
        res=test_app.get('/turma')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/turma/turma_cadastro"><button>Cadastro turma</button></a>''',res.text,res.text)
        self.assertIn('''<a href="/"><button>Voltar</button></a>''', res.text, res.text)

    def test_turma_cadastro(self):
        res=test_app.get('')

if __name__ == '__main__':
    unittest.main()
