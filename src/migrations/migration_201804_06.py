from facade.observador_facade import ObservadorFacade
from facade.loja_facade import LojaFacade
from facade.medalha_facade import MedalhaFacade
from facade.turma_facade import TurmaFacade
from facade.aluno_facade import AlunoFacade
from facade.escola_facade import EscolaFacade
from facade.rede_facade import RedeFacade


aluno_facade = AlunoFacade()
observador_facade = ObservadorFacade()
loja_facade = LojaFacade()
medalaha_facade = MedalhaFacade()
turma_facade = TurmaFacade()
escola_facade = EscolaFacade()
rede_facade=RedeFacade()




observador_facade.create_observador_facade(nome="administrator", senha="@onde2929", telefone="21999999999", cpf="0",
                                           email="admin", tipo=0,
                                           rede=0, escola=0)

aluno_facade.create_aluno_facade(nome=" O Estudante", senha="nuncaSaberao")
rede_facade.create_rede_facade(nome="Rede_Aonde", cod="Rede_Aonde_conect",telefone="(21) 2233-4455")

escola_facade.create_escola_facade(nome="conecturma", rua="Largo do Machado", numero=100, telefone="(21) 99887766",
                                   estado="RJ", cidade="Rio de Janeiro",vinculo_rede="Conecturma_pn", cod_identificacao="plataforma.2")


turma_facade.create_turma_facade(nome="KND", login="Numero um", serie=1, escola=1)


loja_facade.criar_item_loja_facade(nome="Cores", preco="0", tipo="1")
loja_facade.criar_item_loja_facade(nome="Cores2", preco="5", tipo="1")
loja_facade.criar_item_loja_facade(nome="Cores3", preco="10", tipo="1")


loja_facade.criar_item_loja_facade(nome="Rosto", preco="0", tipo="2")
loja_facade.criar_item_loja_facade(nome="Rosto2", preco="5", tipo="2")
loja_facade.criar_item_loja_facade(nome="Rosto3", preco="10", tipo="2")

loja_facade.criar_item_loja_facade(nome="Cabeça", preco="0", tipo="3")
loja_facade.criar_item_loja_facade(nome="Cabeça2", preco="5", tipo="3")
loja_facade.criar_item_loja_facade(nome="Cabeça3", preco="10", tipo="3")

loja_facade.criar_item_loja_facade(nome="Corpo", preco="0", tipo="4")
loja_facade.criar_item_loja_facade(nome="Corpo2", preco="5", tipo="4")
loja_facade.criar_item_loja_facade(nome="Corpo3", preco="10", tipo="4")

medalaha_facade.create_medalha_facade(nome="Medalha1", tipo='1')
medalaha_facade.create_medalha_facade(nome="Medalha2", tipo='2')
medalaha_facade.create_medalha_facade(nome="Medalha3", tipo='1')
medalaha_facade.create_medalha_facade(nome="Medalha4", tipo='1')
medalaha_facade.create_medalha_facade(nome="Medalha5", tipo='2')
