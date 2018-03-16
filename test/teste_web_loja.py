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
    def loja_inicial(self):
        res=test_app