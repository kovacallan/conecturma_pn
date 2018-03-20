import os
import unittest
from webtest import TestApp
import sys
from test import *

sys.path.append('../')
from index import application

# os.environ['WEBTEST_TARGET_URL'] = 'http://localhost:8888'
test_app = TestApp(application)
test_app.set_cookie('login', '2524')

class BlackBoxTest(unittest.TestCase):
    def setUp(self):
            pass

    def _fixloja(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res1= test_app.post('/cadastro_item' , dict(nome='knight', preco= 5 , tipo=2 ))

    def loja_inicial(self):
        self._fixloja()
        res = test_app.get('/loja')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/compras_loja">', res.text, res.text)



if __name__ == '__main__':
    unittest.main()