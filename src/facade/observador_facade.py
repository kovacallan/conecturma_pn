from src.model.observador_model import DbObservador

class ObservadorFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.observador = DbObservador()


    def create_observador_facade(self, nome, senha, telefone, cpf, email, tipo,rede,escola):
        return self.observador.create_observador(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email,
                                                 tipo=tipo, rede=rede,escola=escola)

    def read_observador_facade(self):
        return self.observador.read_observador()

    def update_observador_facade(self, id, nome, telefone, cpf, email):
        return self.observador.update_observador(id, nome, telefone, cpf, email)

    def delete_observador_facade(self, deletar_ids):
        self.observador.delete_observador(deletar_ids=deletar_ids)

    def search_observador_id_facade(self, id):
        return self.observador.search_observador_id(id=id)

    def search_observador_facade(self, nome):
        return self.observador.search_observador(nome)

    def login_date_facade(self, id, data):
        self.observador.login_date(id, data)


