from bottle import route,request, redirect, response
from facade.aluno_facade import AlunoFacade
from facade.historico_facade import HistoricoFacade

aluno_facade = AlunoFacade()
historico_facade = HistoricoFacade()


@route('/login_aluno', method='POST')
def controller_login_entrar_aluno():
    """
    faz o login na conta do aluno recebendo o usuário e senha
    :return: da acesso a pagina "jogar conecturma" , caso o usuário e senha digitados estejam certos
    """
    nome = request.params['usuario']
    senha = request.params['senha']

    if valida_login_aluno(nome, senha):
        create_cookie(nome)
        historico_facade.create_historico_facade(nome, '6')
        redirect('/jogar_conecturma')
    else:
        redirect('/')


def valida_login_aluno(nome, senha):
    """
    Valida o login do aluno ,
    :param nome: nome de login
    :param senha: senha do usuario
    :return: true se o aluno existir e se estiver com usuario e a senha certa
    """
    retorno = aluno_facade.pesquisa_aluno_facade(nome)
    if retorno:
        if retorno.nome == nome and retorno.senha == senha:
            return True
        else:
            return False
    else:
        return False


def create_cookie(parametro):
    response.set_cookie("login", parametro, secret='2524')
