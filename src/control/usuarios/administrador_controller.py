from bottle import route, view, get, request, redirect, template
from control.classes.validar_cadastros_updates import *
from facade.observador_facade import ObservadorFacade
from facade.escola_facade import EscolaFacade
from facade.aluno_facade import AlunoFacade


facade = ObservadorFacade()
escolafacade = EscolaFacade()
aluno_facade = AlunoFacade()


@route('/observador/create_observador_administrador', method="POST")
def controller_observador_cadastro():
    nome = request.params['nome']
    senha = request.params['senha']
    telefone = request.params['telefone']
    cpf = 0
    email = request.params['email']
    tipo = int(request.params['tipo_observador'])
    rede = 0
    escola = 0

    if filtro_cadastro(nome, senha, telefone, cpf, email, tipo):
        facade.create_observador_facade(nome=nome, senha=senha, telefone=telefone, cpf=cpf,email=email, tipo=tipo,
                                            rede=rede,escola=escola)
        redirect('/observador')
    else:
        print("Erro para salvar")
        redirect('/observador')

@route('/pag_administrador')
@view('administrativo.tpl')
def view_adm():
    pass

@get('/pesquisa_aluno_in_turma')
def pesquisar_aluno_turma():
    aluno_=request.params['nome_do_aluno']
    turma_=request.params['nome_da_turma']
    aluno_facade.pesquisa_aluno_turma_facade(aluno_, turma_)

def filtro_cadastro(nome, senha, telefone, email, cpf,tipo):
    valida = ValidaNome(ValidaSenha(ValidaTelefone(ValidaCpf(ValidaEmail(ValidaTipo(ValidaOk()))))))
    return valida.validacao(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email, tipo=tipo)
