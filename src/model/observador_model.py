from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbObservador(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    nome = TextField(fts=True, index=True)
    senha = TextField(default='0')
    telefone = TextField(default='0')
    cpf = TextField(default='0')
    email = TextField(fts=True)
    tipo = TextField(fts=True)
    vinculo_rede = TextField(fts=True, default='0')
    vinculo_escola = TextField(fts=True, default='0')
    vinculo_turma = TextField(fts=True, default='0')
    data_ultimo_login = TextField(default=None)

    def create_observador(self, nome, senha, telefone, email, tipo, escola, vinculo_turma='0',rede='0', cpf='0'):
        """
        cria um observador
        :param nome: nome do observador
        :param senha: senha
        :param telefone: telefone do usuario(opcional)
        :param cpf: cpf(opcional)
        :param email: email
        :param tipo: o tipo de observador , professor , responsave, diretor , gestor ou administrador
        :return: true se criou certinho e false se n deu certo
        """

        if self.create(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo, vinculo_rede=rede,
                       vinculo_escola=escola, vinculo_turma = vinculo_turma):
            return True
        else:
            return False

    def read_observador(self):
        """
        coloca os dados do observador em um dicionario
        :return: o dicionario com os dados
        """
        observador = []
        for read in DbObservador.all():
            observador.append(dict(id=read.id, nome=read.nome, senha=read.senha, telefone=read.telefone, cpf=read.cpf,
                                   email=read.email, tipo=read.tipo, vinculo_rede=read.vinculo_rede,
                                   vinculo_escola=read.vinculo_escola))

        return observador

    def update_observador(self, id, nome, telefone, cpf, email):
        """
        edita o observador
        :param id: id do observador a ser editado
        :param nome: novo nome
        :param telefone: novo telefone
        :param cpf: nvo cpf
        :param email: novo email
        :return:
        """
        observador = DbObservador.load(id)
        observador.nome = nome
        observador.telefone = telefone
        observador.cpf = cpf
        observador.email = email

        observador.save()

    def redefinir_senha(self, id, senha):
        observador = DbObservador.load(id)
        observador.senha = senha

        observador.save()

    def delete_observador(self, deletar_ids):
        """
        delteta os observadores
        :param deletar_ids: lista de ids de observadores a serem deletados
        :return:
        """
        for deletar_ids in deletar_ids:
            usuario = self.load(deletar_ids)
            usuario.delete(deletar_ids)

    def search_observador_id(self, id):
        observador = self.load(id)

        return observador

    def search_observador_email(self, email):

        observador = None
        for search in DbObservador.query(DbObservador.email == email):
            observador = dict(id=search.id, nome=search.nome, senha=search.senha, telefone=search.telefone,
                              cpf=search.cpf, email=search.email, tipo=search.tipo,
                              vinculo_escola=search.vinculo_escola,
                              vinculo_rede=search.vinculo_rede, vinculo_turma=search.vinculo_turma)

        return observador

    def search_observador(self, nome):
        """
        procura o observador e coloca os dados em uma entrada de dicionario
        :param nome: nome do observador
        :return:
        """

        observador = None
        for search in DbObservador.query(DbObservador.nome == nome):
            observador = dict(id=search.id, nome=search.nome, senha=search.senha, telefone=search.telefone,
                              cpf=search.cpf, email=search.email, tipo=search.tipo,
                              vinculo_escola=search.vinculo_escola,
                              vinculo_rede=search.vinculo_rede)

        return observador

    def search_observador_professor_by_escola(self, vinculo_escola):
        """
        procura o observador e coloca os dados em uma entrada de dicionario
        :param nome: nome do observador
        :return:
        """
        observador = []
        for search in DbObservador.query(DbObservador.vinculo_escola == vinculo_escola and DbObservador.tipo == '3',
                                         order_by=DbObservador.nome):
            observador.append(dict(id=search.id, nome=search.nome, senha=search.senha, telefone=search.telefone,
                                   cpf=search.cpf, email=search.email, tipo=search.tipo,
                                   vinculo_escola=search.vinculo_escola,
                                   vinculo_rede=search.vinculo_rede, vinculo_turma=search.vinculo_turma))

        return observador

    def search_observador_tipo(self, tipo):
        """
        procura o observador e coloca os dados em uma entrada de dicionario
        :param nome: nome do observador
        :return:
        """
        observador = []
        for search in DbObservador.query(DbObservador.tipo == tipo, order_by=DbObservador.nome):
            observador.append(dict(id=search.id, nome=search.nome, senha=search.senha, telefone=search.telefone,
                                   cpf=search.cpf, email=search.email, tipo=search.tipo,
                                   vinculo_escola=search.vinculo_escola,vinculo_turma=search.vinculo_turma,
                                   vinculo_rede=search.vinculo_rede))

        return observador

    def search_observador_escola_listagem(self, login, vinculo_escola):
        observador = []
        if login is not '0':
            for read in DbObservador.query(DbObservador.vinculo_escola == vinculo_escola, order_by=DbObservador.nome):
                observador.append(
                    dict(id=read.id, nome=read.nome, senha=read.senha, telefone=read.telefone, cpf=read.cpf,
                         email=read.email, tipo=read.tipo,
                         vinculo_rede=read.vinculo_rede,
                         vinculo_escola=read.vinculo_escola,
                         vinculo_turma=read.vinculo_turma))
        else:
            for read in DbObservador.all():
                observador.append(
                    dict(id=read.id, nome=read.nome, senha=read.senha, telefone=read.telefone, cpf=read.cpf,
                         email=read.email, tipo=read.tipo,
                         vinculo_rede=read.vinculo_rede,
                         vinculo_escola=read.vinculo_escola,
                         vinculo_turma=read.vinculo_turma))

        return observador

    def search_observador_escola_filtro(self, vinculo_escola):
        observador = []
        for read in DbObservador.query(DbObservador.vinculo_escola == vinculo_escola, order_by=DbObservador.nome):
            observador.append(
                dict(id=read.id, nome=read.nome, senha=read.senha, telefone=read.telefone, cpf=read.cpf,
                     email=read.email, tipo=read.tipo,
                     vinculo_rede=read.vinculo_rede,
                     vinculo_escola=read.vinculo_escola,
                     vinculo_turma=read.vinculo_turma))

        return observador


    def search_observador_turma(self, vinculo_turma):
        observador = []
        for read in DbObservador.query(DbObservador.vinculo_turma == vinculo_turma, order_by=DbObservador.nome):
            observador.append(dict(id=read.id, nome=read.nome, senha=read.senha, telefone=read.telefone, cpf=read.cpf,
                     email=read.email, tipo=read.tipo,
                     vinculo_rede=read.vinculo_rede,
                     vinculo_escola=read.vinculo_escola,
                     vinculo_turma=read.vinculo_turma))

        return observador

    def login_date(self, id, data):
        """
        Armazena o historico de login
        :param id: id do usuario que logou
        :param data: data , hora e minutos do login
        :return:
        """
        observador = self.load(id)
        observador.data_login = data
        observador.save()
