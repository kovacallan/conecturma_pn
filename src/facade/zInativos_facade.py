from src.model.zInativos_model import DbCemiterio

class ZinativosFacade:

    def __init__(self):

        self.inativos = DbCemiterio()

    def create_zInativos_atores_facade(self,desativados_atores):
        return self.inativos.fazer_os_de_cima(desativados_atores)

    def create_zInativos_estrutura_facade(self,desativado_estrutura):
        return self.inativos.inativos_estrutura(desativado_estrutura)

    def pesquisa_inativos_facade(self,nome):
        print("hmm,facade",nome)
        return self.inativos.pesquisa_inativo(nome)

    # def complemento_create_facade(self,ator,nome_inativo_complementar):
    #     return self.inativos.complemento_create(ator,nome_inativo_complementar)

    # def fzer_dois(self,inativos):
    #     return self.inativos.fazer_os_de_cima(inativos)