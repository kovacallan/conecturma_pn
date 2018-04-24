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
        test_app.post('/escola/create_escola', dict(nome="Escola Conecturma",                                                                         telefone="21 99445732", cep=""))
        test_app.post('/aluno_cadastro', dict(aluno_nome='eric', escola="2", senha='idle'))
        test_app.post('/login_aluno', dict(usuario='eric', senha='idle'))

    def _fixaluno(self):
        res = test_app.post('/aluno_cadastro', dict(aluno_nome='egg', senha='spam'))
        res2 = test_app.get('/turma_cadastro', dict(turma_nome='ni'))
        res3 = test_app.get('/turma_cadastro', dict(turma_nome='parrot'))
        # res4 = test_app.get('/cadastro_item' , dict(nome='burro quando foge',tipo='3',preco='5'))



if __name__ == '__main__':
    unittest.main()
