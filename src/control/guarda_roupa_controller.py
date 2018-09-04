from facade.facade_main import Facade
from control.dicionarios import TIPO_ITEM

class Guarda_roupa(object):
    def __init__(self, usuario_logado):
        self.usuario_logado = usuario_logado
        self.facade = Facade()
        self.cor = []
        self.rosto = []
        self.acessorio = []
        self.corpo = []

    def get_cor(self):
        return self.cor

    def set_cor(self, cores):
        self.cor = cores

    def get_rosto(self):
        return self.rosto

    def set_rosto(self, rostos):
        self.rosto = rostos

    def get_acessorio(self):
        return self.acessorio

    def set_acessorio(self, acessorios):
        self.acessorio = acessorios

    def get_corpo(self):
        return self.corpo

    def set_corpo(self, corpos):
        self.corpo = corpos

    def get_item_user_have(self):
        if self.usuario_logado['tipo'] == '6'
            itens = self.facade.get_itens_student_facade(id=self.usuario_logado['id'])
            for i in itens:
                item = self.facade.search_estrutura_id_facade(id=i.decode('utf-8'))
                if item['tipo_item'] == TIPO_ITEM['cor']:
                    self.cor.append(item)
                elif item['tipo_item'] == TIPO_ITEM['rosto']:
                    self.rosto.append(item)
                elif item['tipo_item'] == TIPO_ITEM['acessorio']:
                    self.acessorio.append(item)
                else:
                    self.corpo.append(item)