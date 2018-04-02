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


class MyTestCase(unittest.TestCase):
    def setUp(self):
        test_app.post('/aluno_cadastro', dict(aluno_nome='eric', senha='idle'))
        test_app.post('/login', dict(usuario='eric', senha='idle'))

    def _fixaluno_turma_escola(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res = test_app.post('/escola_cadastro', dict(nome='cheese shop', rua='de tras', numero=88, telefone=22668743))

    """Pagina de cadastro(escola.tpl)"""

    def test_escola_inicio(self):
        res = test_app.get('/escola')
        # self._fixaluno_turma_escola()
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<a href="/escola/cadastro">
            <button>criar escola</button>
            </a>''', res.text, res.text)
        self.assertIn('''<a href="escola/read_escola">
            <button>ver escolas cadastradas</button>
            </a>''', res.text, res.text)
        self.assertIn('''<a href="/user_menu">
            <button>Voltar</button>
            </a>''', res.text, res.text)
        # test_app.post('/cadastro_turma', dict(turma_nome='ni'))

    """teste de cadastro turma(turma_cadastro.tpl)"""

    def test_cadastro_escola(self):
        res = test_app.get('/escola/cadastro',
                     dict(nome='parrot', rua='nova rua ', numero=23, telefone='96654321', estado='RJ',
                          cidade='pindamonhagaba', rede='abelhinha', cod_id='ehu745'))
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/cadastro_turma" method="post">', res.text, res.text)
        self.assertIn('<button type="submit">Enviar</button>', res.text, res.text)

        "Teste de ler "

    def _test_ler(self):
        pass

if __name__ == '__main__':
    unittest.main()
