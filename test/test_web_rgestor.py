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
        # test_app.post('/escola/create_escola', dict(nome="Escola Conecturma",telefone="21 99445732", cep=""))
        test_app.post('/aluno_cadastro', dict(aluno_nome='eric', escola="2", senha='idle'))
        test_app.post('/login_aluno', dict(usuario='eric', senha='idle'))

    def _fixaluno(self):
        res = test_app.post('/turma/cadastro_turma', dict(turma_nome="cheese shop", serie="2", escola="1", ))
        res1 = test_app.post('/aluno_cadastro', dict(aluno_nome='Wizzo', escola="2", senha='naosei'))
        res2 = test_app.post('/observador/create_observador_professor',
                             dict(nome='theLarch', senha="spam", telefone="21 99887342", email="teste@teste.test.te",
                                  tipo_observador="3", escola="2", vinculo_rede="0"))
        res3 = test_app.post('/escola/escola_cadastro', dict(nome="confuse-a-cat", telefone="159874365", cep="22298111",
                                                          estado="Solido molinho , meio liquido", uf="AC",
                                                          numero="42"))

    def test_escola(self):
        self._fixaluno()
        res = test_app.get('/escola')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/">
                <button>Voltar</button>
            </a>''', res.text, res.text)
        self.assertIn('''<a href="/escola/cadastro">
                <button>criar escola</button>
            </a>''', res.text, res.text)
        self.assertIn("confuse-a-cat", res.text, res.text)


if __name__ == '__main__':
    unittest.main()
