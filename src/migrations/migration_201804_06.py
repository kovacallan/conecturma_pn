from facade.observador_facade import ObservadorFacade
from facade.loja_facade import LojaFacade
from facade.medalha_facade import MedalhaFacade

observador_facade = ObservadorFacade()
loja_facade = LojaFacade()
medlaha_facade = MedalhaFacade()

observador_facade.create_observador_facade(nome="administrator", senha="@onde2929", telefone="21999999999", cpf="0",email="admin", tipo=0,
                                            rede=0,escola=0)

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

medlaha_facade.create_medalha_facade(nome="Medalha1")
medlaha_facade.create_medalha_facade(nome="Medalha2")
medlaha_facade.create_medalha_facade(nome="Medalha3")
medlaha_facade.create_medalha_facade(nome="Medalha4")
medlaha_facade.create_medalha_facade(nome="Medalha5")

