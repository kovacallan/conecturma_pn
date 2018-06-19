from model.estrutura_model import DbEstrutura


class EstruturaFacade:

    def __init__(self):
        self.estrutura = DbEstrutura()

    def create_estrutura_facade(self, **kwargs):
        return self.estrutura.create_estrutura(**kwargs)

    def read_estrutura_facade(self, tipo_estrutura):
        return self.estrutura.read_estrutura(tipo_estrutura=tipo_estrutura)

    def update_estrutura(self, nome, tipo_estrutura, telefone='0', vinculo_rede='0', vinculo_escola='0',
                                cep='0', endereco='0', numero='0', estado='0', uf='0', quem_criou='0', serie='0',
                                tipo_item='0', preco='0', tipo_medalha='0',
                                descricao='0', descricao_completa='0', nome_usuario='0', tipo_usuario='0'):

        return self.estrutura.update_estrutura(nome=nome, tipo_estrutura=tipo_estrutura, telefone=telefone,
                                        vinculo_rede=vinculo_rede, vinculo_escola=vinculo_escola, cep=cep,
                                        endereco=endereco, numero=numero, estado=estado, uf=uf, quem_criou=quem_criou,
                                        serie=serie, tipo_item=tipo_item, preco=preco, tipo_medalha=tipo_medalha,
                                        descricao=descricao, descricao_completa=descricao_completa,
                                        nome_usuario=nome_usuario, tipo_usuario=tipo_usuario)

    def search_estrutura_facade(self, tipo_estrutura, nome):
        return self.estrutura.search_estrutura(tipo_estrutura=tipo_estrutura, nome= nome)

    def search_estrutura_id_facade(self, id):
        return self.estrutura.search_estrutura_id(id=id)

    def search_estrutura_escola_by_rede_facade(self,vinculo_rede):
        return self.estrutura.search_escola_by_rede(vinculo_rede=vinculo_rede)

    def search_estrutura_turma_by_rede_facade(self,vinculo_rede):
        return self.estrutura.search_turma_by_rede(vinculo_rede=vinculo_rede)

    def search_estrutura_turma_by_escola_facade(self,vinculo_escola):
        return self.estrutura.search_turma_by_escola(vinculo_escola=vinculo_escola)

    def ja_tem_item_facade(self, usuario_logado):
        """
        Mostra se o usuario ja comprou o item
        :param usuario_logado:autoexplicativo
        :return:lista de itens q ele nao tem
        """
        return self.estrutura.ja_possui_item(usuario_logado=usuario_logado)