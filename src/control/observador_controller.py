from facade.facade_main import Facade
from control.dicionarios import TIPO_USUARIOS, TIPO_ESTRUTURA
class Observador(object):

    def __init__(self,observador_logado):
        self.facade = Facade()
        observador_logado = self.facade.search_observador_id_facade(id=observador_logado['id'])
        self._observador_nome = observador_logado['nome']
        self._observador_tipo = observador_logado['tipo']
        self._rede = observador_logado['vinculo_rede']
        self._escola = observador_logado['vinculo_escola']
        self._turma = observador_logado['vinculo_turma']

    def get_observador_nome(self):
        return self._observador_tipo

    def get_observador_tipo(self):
        return self._observador_tipo

    def get_rede(self, id_rede=None):
        if(self._observador_tipo == TIPO_USUARIOS['administrador']):
            if(id_rede == None):
                self._rede = self.facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['rede'])
            else:
                self._rede = self.facade.search_estrutura_id_facade(id=id_rede)
        else:
            self._rede = self.facade.search_estrutura_id_facade(id=self._rede)

        return self._rede

    def get_escola(self, id_escola=None, id_rede=None):
        if(id_rede == None):
            if (self._observador_tipo == TIPO_USUARIOS['administrador']):
                if id_escola == None:
                    self._escola = self.facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['escola'])
                else:
                    self._escola = self.facade.search_estrutura_id_facade(id=id_escola)
            elif (self._observador_tipo == TIPO_USUARIOS['gestor']):
                if(id_escola == None):
                    self._escola = self.facade.search_estrutura_escola_by_rede_facade(vinculo_rede=self.get_rede()['id'])
                else:
                    self._escola = self.facade.search_estrutura_id_facade(id=id_escola)
            else:
                self._escola = self.facade.search_estrutura_id_facade(id=self._escola)
        else:
            self._escola = self.facade.search_estrutura_escola_by_rede_facade(vinculo_rede=id_rede)
        return self._escola

    def get_turma(self,id_turma = None, serie = None, id_escola = None):
        if(id_turma == None):
            if (self._observador_tipo == TIPO_USUARIOS['administrador']):
                if id_escola != None:
                    self._turma = []
                    turma = self.facade.search_estrutura_turma_by_escola_facade(vinculo_escola=id_escola)
                    if serie != None:
                        for i in turma:
                            if i['serie'] == serie:
                                self._turma.append(i)
                    else:
                        self._turma = turma
                elif serie != None:
                    self._turma = []
                    for i in self.facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma']):
                        if i['serie'] == serie:
                            self._turma.append(i)
                else:
                    self._turma = self.facade.read_estrutura_facade(tipo_estrutura=TIPO_ESTRUTURA['turma'])

            elif (self._observador_tipo == TIPO_USUARIOS['gestor']):
                if(id_escola == None):
                    self._turma = self.facade.search_estrutura_turma_by_rede_facade(vinculo_rede=self._rede)
                else:
                    self._turma = []
                    for i in self.facade.search_estrutura_turma_by_escola_facade(vinculo_escola=id_escola):
                        if i['serie'] == serie:
                            self._turma.append(i)

            elif (self._observador_tipo == TIPO_USUARIOS['diretor']):
                if serie != None:
                    self._turma = []
                    for i in self.facade.search_estrutura_turma_by_escola_facade(vinculo_escola=self._escola['id']):
                        if i['serie'] == serie:
                            self._turma.append(i)
                else:
                    self._turma = self.facade.search_estrutura_turma_by_escola_facade(vinculo_escola=self._escola['id'])


            else:
                self._turma = self.facade.search_estrutura_id_facade(id=self._turma)
        else:
            self._turma = self.facade.search_estrutura_id_facade(id=id_turma)

        return self._turma