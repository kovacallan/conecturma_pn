from src.model.medalha_model import DbMedalha
from src.model.aluno_model import DbAluno
from src.model.observador_model import DbObservador
from src.model.turma_model import DbTurma
from src.model.loja_model import DbLoja
from src.model.rede_model import DbRede
from src.model.escola_model import DbEscola
from src.model.historico_model import DbHistorico

class Facade:

    def __init__(self):
        """
        método para utilização do banco de dados
        """
        self.escola = DbEscola()
        self.aluno = DbAluno()
        self.observador = DbObservador()
        self.rede = DbRede()
        self.turma = DbTurma()
        self.loja = DbLoja()
        self.historico = DbHistorico()
        self.medalha = DbMedalha()

    """
        Inicio Facade Usuario/Aluno
        
    """

    def create_aluno_facade(self, nome, senha):
        """
        Cria um aluno no banco de dados
        :param nome: nome do aluno/usuario
        :param senha: senha para logar
        :return:None
        """
        return self.aluno.create_aluno(nome, senha)

    def read_aluno_facade(self):
        """
        Visualiza todos os alunos criados
        :return: Um dicionario com os principais dados de aluno: id , matricula , nome e turma
        """
        return self.aluno.read_usuario()

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

    """
    
        Fim Facade Usuario/Aluno
        
    """

    """
    
        Inicio Facade observador
        
    """

    def create_observador_facade(self, nome, senha, telefone, cpf, email, tipo):
        return self.observador.create_observador(nome=nome, senha=senha, telefone=telefone, cpf=cpf, email=email,
                                                 tipo=tipo)

    def read_observador_facade(self):
        return self.observador.read_observador()

    def update_observador_facade(self, id, nome, telefone, cpf, email):
        return self.observador.update_observador(id, nome, telefone, cpf, email)

    def delete_observador_facade(self, deletar_ids):
        self.observador.delete_observador(deletar_ids=deletar_ids)

    def search_observador_facade(self, nome):
        return self.observador.search_observador(nome)

    def login_date_facade(self, id , data):
        self.observador.login_date(id,data)
    """
    
        Fim Facade observador
        
    """

    """
    
        Inicio Facade Rede
        
    """

    def create_rede_facade(self, nome, cod, telefone):
        """
        cria uma rede no banco de dados
        :param nome: nome da rede
        :param cod: codigo de identificaçao
        :param telefone: telefone da sede
        :return: o rede criada no banco de dados
        """
        return self.rede.create_rede(nome=nome, cod=cod, telefone=telefone)

    def read_rede_facade(self):
        """
        Ver as redes que se encontram no banco d dados . com id , nome , cod e telefone da rede
        :return:a lista de ree com os atributos relevantes da rede a serem mostrados
        """
        return self.rede.read_rede()

    def update_rede_facade(self, id, nome, cod, telefone):
        return self.rede.update_rede(id, nome, cod, telefone)

    def delete_rede_facade(self, ids):
        """
        muda o nome , o cogigo ou o telefone da rede
        :param id: id da rede a ser modificada
        :param nome: novo nome da rede
        :param cod: novo codigo da rede
        :param telefone: novo telefone da sede da rede
        :return: se foi bem sucessedido retorna true , se n , false
        """
        return self.rede.update_rede(ids)

    def delete_rede_facade(self, ids):
        """
        deleta a rede por uma lista de ids d redes a serem deletados
        :param ids: lista de
        :return:
        """
        return self.rede.delete_rede(ids)

    def pesquisa_rede_facade(self, rede):
        return self.rede.pesquisa_rede(rede)

    """
    
        Fim Facade Rede
        
    """

    """
    
        Inicio Facade Turma
        
    """

    def create_turma_facade(self, nome, login):
        """
        Cria uma turma no banco de dados
        :param nome: Nome da turma
        :param login: Nome do criador da turma
        :return: None
        """
        return self.turma.create_turma(nome, login)

    def read_turma_facade(self):
        """
        Mostra as turmas criadas
        :return:Um dicionario com os valores:id , nome da turma , criador , desempenho j1 e desempenho j2 da turma
        """
        return self.turma.read_turma()

    def delete_turma_facade(self, id):
        """
        Deleta uma turma pelo id
        :param id:id da turma
        :return:None
        """
        self.turma.delete_turma(id)

    def pesquisa_turma_facade(self, turma_nome):
        return self.turma.pesquisa_turma(turma_nome)

    def update_turma_facade(self, id, turma_nome, professor_encarregado):
        self.turma.turma_update(id, turma_nome, professor_encarregado)

    """
    
            Fim Facade Turma
    
    """

    """
    
            Inicio Facade Escola
    
    """

    def create_escola_facade(self, nome, rua, numero, telefone, estado, cidade,rede_pertencente, cod_identificacao):
        return self.escola.create_escola(nome, rua, numero, telefone, estado, cidade,rede_pertencente, cod_identificacao)

    def read_escola_facade(self):
        return self.escola.read_escola()

    def update_escola_facade(self, id, nome, rua, numero,cidade,estado, telefone, rede_pertencente, cod_identificacao):
        return self.escola.update_escola(id, nome, rua, numero,cidade,estado, telefone, rede_pertencente, cod_identificacao)

    def delete_escola_facade(self, deletar_ids):
        return self.escola.delete_escola(deletar_ids)

    def pesquisa_escola_facade(self, nome):
       return self.escola.search_escola(nome)


    """
    
            Fim Facade Escola
            
    """


    """
    
        Inicio Facade loja
        
        
    """

    def criar_item_loja_facade(self, nome, tipo, preco):
        """
        Cria o item no banco de dados
        :param nome:nome do item
        :param tipo:Se é cor(1) , rosto(2) , acessorio(3) ou corpo(4)
        :param preco:preço atribuido ao item
        :return:None
        """
        self.loja.create_item(nome, tipo, preco)

    def read_item_loja_facade(self):
        """
        cria uma lista com os itens armazenados na base de dados , com seus valores de id , nome ,tipo e preço
        :return:Lista dos itens criados
        """
        return self.loja.read_item()

    def pesquisa_item_facade(self, id):
        """
        pesquisa itens por id (ainda nao implementado)
        :param id: id do item
        :return: o objeto do item
        """
        return self.loja.pesquisar_item(id)

    def deletar_item(self, id):
        """
        deleta o item por id (ainda nao implementado)
        :param id: o id do item
        :return: None
        """
        self.loja.item_delete(id)

    def ja_tem_item_facade(self, usuario_logado):
        """
        Mostra se o usuario ja comprou o item
        :param usuario_logado:autoexplicativo
        :return:lista de itens q ele nao tem
        """
        return self.loja.ja_possui_item(usuario_logado=usuario_logado)

    """
    
    
        Fim Facade loja
        
        
    """


    """
    
        Inicio Facade Medalhas
        
    """
    def create_medalha_facade(self, nome, tipo):
        self.medalha.create_medalha(nome, tipo)

    def read_medalha_facade(self):
        self.medalha.read_medalha()

    def delete_medalha_facade(self, delete_ids):
        self.medalha.delete_medalha(delete_ids)

    def pesquisa_medalha_facade(self, nome):
        self.medalha.pesquisa_medalha(nome)

    """
          Fim de Facade Medalhas
            
    """

    """
        Inicio Facade Historico
        
        
    """

    def create_historico_facade(self, nome,tipo):
        self.historico.create_historico(nome,tipo)

    def read_historico_facade(self):
        return self.historico.read_historico()

    """
           
           Fim Facade Historico
           
           
    """

