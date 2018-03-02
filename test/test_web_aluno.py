import os
import unittest
from webtest import TestApp
import sys
sys.path.append('../')
from index import application

# os.environ['WEBTEST_TARGET_URL'] = 'http://localhost:8888'
test_app = TestApp(application)


class BlackBoxTest(unittest.TestCase):
    """ check when there is query """
    def test_upper_change(self):
        res = test_app.get('/')
        self.assertEqual(res.status_int, 200)
        self.assertIn('name="usuario"', res.text, res.text)
        # self.assertEqual(res.json['upper_query'], 'FOO')

    """ check when there is no query. """
    def test_no_query(self):
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('<form action="/deletar_alunos">', res.text, res.text)


class _WhiteBoxTe_st(unittest.TestCase):
    """ check upper case changing. """
    def _test_upper_change(self):
        rs = application.read_aluno()
        self.assertEqual(rs._big_letter("foo"), 'FOO')


if __name__ == '__main__':
    unittest.main()