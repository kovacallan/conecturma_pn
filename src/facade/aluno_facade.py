from model.aluno_model import DbAluno

class AlunoFacade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.aluno = DbAluno()

    def create_aluno_facade(self, nome, escola,senha):
        """
        Cria um aluno no banco de dados
        :param nome: nome do aluno/usuario
        :param senha: senha para logar
        :return:None
        """
        return self.aluno.create_aluno(nome=nome, vinculo_escola = escola,senha=senha)

    def read_aluno_facade(self):
        """
        Visualiza todos os alunos criados
        :return: Um dicionario com os principais dados de aluno: id , matricula , nome e turma
        """
        return self.aluno.read_aluno()

    def update_aluno_facade(self, id, nome, senha):
        """
        modifica o usuario(nome) e senha do aluno
        :param id: id od usuario a ser modificado
        :param nome:novo nome
        :param senha:nova senha
        :return:se conseguiu modificar com sucesso
        """
        return self.aluno.update_aluno(id=id, nome=nome, senha=senha)

    def delete_aluno_facade(self, deletar_ids):
        """
        Cria uma lista de ids de alunos e os deleta do banco de dados
        :param deletar_ids: lista de ids a serem deletados
        :return: None
        """
        self.aluno.aluno_delete(deletar_ids)

    def pesquisa_aluno_facade(self, nome):
        """
        Pesquisa pelo aluno através do nome , apenas usado na tela de login e como auxiliar para modificar atributos do
         aluno
        :param nome: Nome dado do aluno
        :return:retorna o usuario aluno (objeto)
        """
        return self.aluno.pesquisa_usuario(nome)

    def ponto_jogo_facade(self, usuario, jogo, ponto):
        """
        Faz a contagem de pontos e as suas consequencias (vidas , moedas , contador de cliques e medidor de desempenho)
        (A ser melhorada , para diminuir)
        :param usuario: O objeto do aluno que esta jogando o jogo
        :param jogo: O jogo , j1 ou j2
        :param ponto: O valor de pontos acrescidos , 0 ou 1
        :return: None
        """
        return self.aluno.pontos_jogo(usuario, jogo, ponto)

    def aluno_in_turma_facade(self, escolhidos, turma_add):
        """
        Pega uma lista de alunos previamente selecionados(lista de id's) e acrescenta o id da turma em seus atributos
        :param escolhidos: Lista de alunos , ids
        :param turma_add: Id da turma
        :return: None
        """
        self.aluno.alunos_in_turma(escolhidos, turma_add)

    def compra_item_facade(self, id_usuario, id_item):
        """
        Acrescenta o id do item a lista itens_comprados do usuario que comprou o item
        :param id_usuario: id do usuario(aluno) que comprará o item
        :param id_item: id do item a ser comprado
        :return: None
        """
        self.aluno.comprar_item(id_usuario=id_usuario, id_item=id_item)

    def ver_item_comprado_facade(self, id_usuario):
        """
        Coloca os ids dos itens do usuario numa lista e mostra
        :param id_usuario: id do usuario que quer ver seus itens (dentro da lista items_comprado)
        :return: A lista de ids dos itens do usuario
        """
        return self.aluno.ver_itens_comprados(id_usuario)

    def equipar_item_facade(self, id, itens):
        """
        Equipa o item no avatar do usuario
        :param id: id do usuario que vai equipar os itens
        :param itens: id do item a ser equipado no avatar
        :return: None
        """
        self.aluno.equipar_item(id_usuario=id, itens=itens)

    def avatar_facade(self, id):
        """
        Mostra o avatar
        :param id: id do usuario atual usando a aplicaçao
        :return: Um dicionario com o avatar equipado com cor, rosto, acessorio e  corpo , caso nada esteja equipado ,
        tudo fica com o valor default
        """
        return self.aluno.avatar(id)

    def anotacoes_aluno_facade(self,usuario_id, mensagem):
        self.aluno.anotacoes_do_aluno(usuario_id, mensagem)
    def read_anotacoes_aluno_facade(self,usuario_id):
        return self.aluno.ver_anotacoes_aluno(usuario_id)

    def pesquisa_aluno_turma_facade(self,aluno_, turma_):
        return self.aluno.pesquisa_aluno_turma(aluno_,turma_)