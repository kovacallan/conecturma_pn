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
        test_app.post('/aluno_cadastro', dict(aluno_nome='eric', senha='idle'))
        test_app.post('/login', dict(usuario='eric', senha='idle'))

    def _fixloja(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res1 = test_app.post('/cadastro_item', dict(nome='knight', preco=5, tipo=2))

    """TESTE DA PAGINA INICIAL DE LOJA(index_loja.tpl)"""
    def test_loja_inicial(self):
        self._fixloja()
        res = test_app.get('/loja')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/compras_loja">', res.text, res.text)
        self.assertIn('<a href="/cadastrar_item">', res.text,res.text)
    """Teste de cadastro de item"""
    def test_cadastro_itens(self):
        res = test_app.get('/cadastrar_item')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/cadastro_item" method="post">', res.text, res.text)
        self.assertIn('<select name="tipo">', res.text, res.text)
    """teste de ver item(ver_item.tpl)"""
    def test_read_item(self):
        self._fixloja()
        res = test_app.get('/ver_item')
        self.assertEqual(res.status_int,200)
        self.assertIn(''' <div class="col-md-3">
                knight
                <br>
                <br>
            </div>''', res.text, res.text)
        self.assertIn('''  <div class="col-md-3">
                5
                <br>
                <br>
            </div>''', res.text, res.text)

if __name__ == '__main__':
    unittest.main()
