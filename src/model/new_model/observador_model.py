# encoding: utf-8

from walrus import *
from datetime import date
from .usuario_model import Usuario
from control.dicionarios import, PAGINA_INICIAL, TIPO_USUARIOS_ID

db = Database(host='localhost', port=6379, db=0)

class Observador(Model, Usuario):
    __database__ = db
    telefone = TextField(default='0')
    cpf = TextField(default='0')
    data_nascimento = TextField(fts=True, default='0')
    tipo = TextField(fts=True)
    nome_foto_perfil = TextField(default='default-profile.png')
    data_ultimo_login = TextField(default='', index=True)
    ativo = TextField(default='0')
    aux_css_foto = TextField(default='0')

    def login(self, email, senha):
        for i in Observador.query((Observador.email == email)):
            if i:
                if i.email==email and i.senha==senha:
                    return PAGINA_INICIAL[TIPO_USUARIOS_ID[i.d.lower()]
                else:
                    return False
            else:
                return False

    def create_observador(self, nome, senha, email, tipo,vinculo_escola='0', vinculo_turma='0'):
        self.create(nome=nome, senha=senha, email=email, tipo=tipo,vinculo_escola=vinculo_escola, vinculo_turma=vinculo_turma)

    def read_observador(self):
        observador = []
        for i in self.all():
            observador.append(i)

        return observador