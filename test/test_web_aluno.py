import os
import unittest
from webtest import TestApp
import sys
sys.path.append('../')
from index import application

# os.environ['WEBTEST_TARGET_URL'] = 'http://localhost:8888'
test_app = TestApp(application)


class BlackBoxTest(unittest.TestCase):
    def test_index(self):
        """ o indice dev eser servido """
        res = test_app.get('/')
        self.assertEqual(res.status_int, 200)
        self.assertIn('name="usuario"', res.text, res.text)
        # self.assertEqual(res.json['upper_query'], 'FOO')

    def _test_read_student(self):
        """ A página dos alunos deve permitir deletar aluno. """
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/deletar_alunos">', res.text, res.text)


if __name__ == '__main__':
    unittest.main()