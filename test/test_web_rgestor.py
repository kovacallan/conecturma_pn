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
        test_app.post('/observador/create_observador_gestor',
                      dict(nome='smoketoomuch', senha='bat', telefone="(21) 22134562",
                           cpf="0",email="tent@c.ul.os",tipo_observador="1",rede="umarede",escola="2"))

        test_app.post('/login_observador', dict(usuario='smoketoomuch', senha='bat'))

    def _fixaluno(self):
        res = test_app.post('/turma/cadastro_turma', dict(turma_nome="cheese shop", serie="2", escola="1", ))
        res1 = test_app.post('/aluno_cadastro', dict(aluno_nome='Wizzo', escola="2", senha='naosei'))
        res2 = test_app.post('/observador/create_observador_professor',
                             dict(nome='theLarch', senha="spam", telefone="21 99887342", email="teste@teste.test.te",
                                  tipo_observador="3", escola="2", vinculo_rede="0"))
        res3 = test_app.post('/escola/criar_escola', dict(vinculo_rede="0",nome="confuse-a-cat", telefone="159874365", cep="22298111",
                                                          estado="Solido meio liquido", uf="AC",
                                                          numero="42"))

    def test_escola(self):
        self._fixaluno()
        res = test_app.get('/escola')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/">
                <button>Voltar</button>
            </a>''', res.text, res.text)
        self.assertIn('''<a href="/escola/escola_cadastro">
                <button>criar escola</button>
            </a>''', res.text, res.text)
        self.assertIn("confuse-a-cat", res.text, res.text)
    def _test_cadastro_escola(self):
        res = test_app.get('/escola/escola_cadastro')
        self.assertEqual(res.status_int,200)
        self.assertIn('<form action="/escola/criar_escola" method="post">',res.text,res.text)
        self.assertIn(' <button type="submit">Enviar</button>',res.text,res.text)
        self.assertIn('')

if __name__ == '__main__':
    unittest.main()
