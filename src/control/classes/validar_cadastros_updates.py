class ValidaNome:
    def __init__(self, proxima_validacao):
        self.proxima_validacao = proxima_validacao

    def validacao(self, nome, senha, telefone, cpf, email, tipo):
        if nome == "":
            return False
        else:
            return self.proxima_validacao.validacao(senha, telefone, cpf, email, tipo)


class ValidaSenha:
    def __init__(self, proxima_validacao):
        self.proxima_validacao = proxima_validacao

    def validacao(self, senha, telefone, cpf, email, tipo):
        if senha == "":
            return False
        else:
            return self.proxima_validacao.validacao(telefone, cpf, email, tipo)


class ValidaTelefone:
    def __init__(self, proxima_validacao):
        self.proxima_validacao = proxima_validacao

    def validacao(self, telefone, cpf, email, tipo):
        if telefone == "":
            return False
        else:
            return self.proxima_validacao.validacao(cpf, email, tipo)


class ValidaCpf:
    def __init__(self, proxima_validacao):
        self.proxima_validacao = proxima_validacao

    def validacao(self, cpf, email, tipo):
        if cpf == "":
            return False
        else:
            return self.proxima_validacao.validacao(email, tipo)


class ValidaEmail:
    def __init__(self, proxima_validacao):
        self.proxima_validacao = proxima_validacao

    def validacao(self, email, tipo):
        if email == "":
            return False
        else:
            return self.proxima_validacao.validacao(tipo)


class ValidaTipo:
    def __init__(self, proxima_validacao):
        self.proxima_validacao = proxima_validacao

    def validacao(self, tipo):
        if tipo == "":
            return False
        else:
            return self.proxima_validacao.validacao()


class ValidaOk:
    def validacao(self):
        return True
