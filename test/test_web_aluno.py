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

    def _fixaluno(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))

    def test_index(self):
        """ o indice dev eser servido """
        res = test_app.get('/')
        self.assertEqual(res.status_int, 200)
        self.assertIn('name="usuario"', res.text, res.text)
        # self.assertEqual(res.json['upper_query'], 'FOO')

    def _test_loja(self):
        res = test_app.get('/loja')
        self.assertIn('<form action="/compras_loja">', res.text, res.text)

    def test_read_student(self):
        """ A página dos alunos deve permitir deletar aluno. """
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn(
            '<button type="submit" name ="deletar_da_turma" formaction="/deletar_alunos">deletar alunos selecionados</button>',
            res.text, res.text)

    """def _test_aluno_cadastro(self):
        res = test_app.get('/cadastro_aluno')
        res = form.submit()
        res = form.submit('submit')
        print(res)"""

    def test_score_coins_lifes(self):
        """A pagina de Score deve mostrar a pontuaçao de J1 , J2 , Moedas , Vidas e desempenho do aluno em cada jogo"""

        res = test_app.get('/mostrar_score')
        self.assertEqual(res.status_int, 200)
        # self.assertEqual('{{desempenho_j1}}', 10)
        # self.assertEqual('{{desempenho_j2}}', 2.0)
        #self.assertEqual('{{pontos_de_vida}}', 2.0)
        #self.assertEqual('{{pontos_moedas}}', 2.0)

    def _test_alun_in_turma(self):
        self._fixaluno()
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<input type="checkbox" name="aluno_id">egg''', res.text, res.text)
        self.assertIn('''dead</option>''', res.text, res.text)

    def _test_del_alunos(self):
        res = test_app.get('/ler_aluno')
        self.assertIn(
            '<button type="submit" name ="deletar_da_turma" formaction="/deletar_alunos">deletar alunos selecionados</button>',
            res.text,
            res.text)

    def ver_itens(self):
        res = test_app.get('/ver_itens_comprados')
        self.assertIn('<form action="/equipar_item" method="post">')


if __name__ == '__main__':
    unittest.main()
