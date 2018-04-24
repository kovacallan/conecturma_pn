from index import application
import unittest
from webtest import TestApp, TestResponse
import sys
from http.cookiejar import CookieJar

test_app = TestApp(application, cookiejar=CookieJar())
test_response = TestResponse()
sys.path.append('../')


class BlackBoxTest(unittest.TestCase):
    def setUp(self):
        # test_app.post('/login_observador',dict(usuario= 'administrator', senha="@onde2929"))
        test_app.post('/observador/create_observador_diretor',
                      dict(nome='dir', senha="quero", telefone="21 99887342", cpf="98536161",
                           email="teste@teste.test.te", tipo_observador="2", escola="2", vinculo_rede='0'))
        test_app.post('/login_observador', dict(usuario='dir', senha='quero'))
    def _fixdir(self):
        res=test_app.post('/turma/cadastro_turma',dict(turma_nome="cruchy frog",serie="2",escola="1",))

    def test_inicial(self):
        res = test_app.get('/gestao_aprendizagem')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/turma">TURMA</a><br>''',res.text,res.text)
        self.assertIn(''' <a href="/usuario">USUÁRIOS</a><br>''',res.text,res.text)
        self.assertIn('''<h2>Bem Vindo dir </h2>''',res.text,res.text)

    def test_turma(self):
        self._fixdir()
        res = test_app.get('/turma')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/turma/turma_cadastro"><button>Cadastro turma</button></a>''',res.text,res.text)
        self.assertIn('''<a href="/"><button>Voltar</button></a>''', res.text, res.text)
        self.assertIn('''cruchy frog''', res.text, res.text)

    def cadastrar_turma(self):
        res = test_app.get('/turma/turma_cadastro')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<form action="/turma/cadastro_turma" method="post">''', res.text, res.text)
        self.assertIn('''<select name="serie">
                     <option value="0">pré-escola</option>
                     <option value="1">1ª Ano</option>
                     <option value="2">2ª Ano</option>
                     <option value="3">3ª Ano</option>
                 </select>''', res.text, res.text)
        self.assertIn('''<button type="submit">Enviar</button>''')
        self.assertIn('''<a href="/turma"><button>Voltar</button></a>''', res.text, res.text)

    def _test_turma_after(self):
        self._fixdir()
        res = test_app.get('/turma')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/turma/turma_cadastro"><button>Cadastro turma</button></a>''',res.text,res.text)
        self.assertIn('''<a href="/"><button>Voltar</button></a>''', res.text, res.text)
        self.assertIn('''cruchy frog ''',res.text,res.text)

if __name__ == '__main__':
    unittest.main()
