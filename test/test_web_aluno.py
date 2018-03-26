import os
import unittest

import webob
from webtest import TestApp, TestResponse
import sys
from test import *
import re

from model.aluno_model import DbAluno

sys.path.append('../')
from index import application

# os.environ['WEBTEST_TARGET_URL'] = 'http://localhost:8888'
test_app = TestApp(application)
test_follow = TestResponse()
# test_app.set_cookie('login', '2524')
# test_app.authorization()


class BlackBoxTest(unittest.TestCase):
    def setUp(self):
        pass

    def _fixaluno(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res2 = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res3 = test_app.get('/turma_cadastro', dict(turma_nome='ni'))
        res4 = test_app.get('/turma_cadastro', dict(turma_nome='parrot'))

    def test_index(self):
        """ o indice desse servidor """
        res = test_app.get('/')
        self.assertEqual(res.status_int, 200)
        self.assertIn('name="usuario"', res.text, res.text)
        # self.assertEqual(res.json['upper_query'], 'FOO')

    def test_read_student(self):
        """ A página dos alunos deve permitir deletar aluno. """
        self._fixaluno()
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn(
            '<button type="submit" name ="deletar_estudantes" formaction="/deletar_alunos">deletar alunos selecionados</button>',
            res.text, res.text)
        self.assertIn('<form action="/turma_aluno" >', res.text, res.text)
        self.assertIn('<input type="checkbox" name="aluno_', res.text, res.text)
        self.assertIn('ni', res.text, res.text)
        self.assertIn(
            '<button type="submit" name ="deletar_estudantes" formaction="/deletar_alunos">deletar alunos selecionados</button>'
            , res.text, res.text)

    def _test_jogo(self):
        self._fixaluno()
        res = test_app.get("/jogos")
        self.assertEqual(res.status_int, 200)
        self.assertIn(' <form action="/ponto" method="get">', res.text,res.text)



    def _test_score_coins_lifes(self):
        """A pagina de Score deve mostrar a pontuaçao de J1 , J2 , Moedas , Vidas e desempenho do aluno em cada jogo"""
        res = test_app.get('/mostrar_score')
        # res3= request
        res1 = test_follow.follow()
        self.assertEqual(res.status_int, 200)
        # self.assertEqual('{{desempenho_j1}}', 10)
        # self.assertEqual('{{desempenho_j2}}', 2.0)
        # self.assertEqual('{{pontos_de_vida}}', 2.0)
        # self.assertEqual('{{pontos_moedas}}', 2.0)

    def _test_alun_in_turma(self):
        self._fixaluno()
        res = test_app.get('/ler_aluno')
        self.assertEqual(res.status_int, 200)
        self.assertIn('''<input type="checkbox" name="aluno''', res.text, res.text)
        self.assertIn("egg</input>", res.text, res.text)
        self.assertIn('''<option value=''', res.text, res.text)

    def test_del_alunos(self):
        res = test_app.get('/ler_aluno')
        self.assertIn(
            '<button type="submit" name ="deletar_estudantes" formaction="/deletar_alunos">deletar alunos selecionados</button>',
            res.text,
            res.text)

    def ver_itens(self):
        res = test_app.get('/ver_itens_comprados')
        self.assertIn('<form action="/equipar_item" method="post">')

test_app.reset()
if __name__ == '__main__':
    unittest.main()


