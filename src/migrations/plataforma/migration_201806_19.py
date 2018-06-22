from src.facade.facade_main import *
from src.control.dicionarios import TIPO_ESTRUTURA,TIPO_USUARIOS,TIPO_OAS_ID
from model.estrutura_model import *

estrutura = DbEstrutura()
facade=Facade()


facade.create_observador_facade(nome="administrador", senha="@onde2929", telefone="21999999999", cpf="0",email="admin", tipo='0',
                                            rede='0',escola='0')

facade.create_estrutura(nome='Estante', sigla_oa='UV1AV1UD1OA01', descricao='Distinguir coisas onde podemos encontrar números (Números e Operações - algebra e Funções)',
                        tipo_oa= TIPO_OAS_ID['MINI_GAME'], unidade='1', sigla_descritor='NU1.01', nome_descritor='Estante de Leitura',
                        descricao_descritor='Localizar acontecimentos no tempo (ontem, hoje, amanhã)', serie='1', disciplina='2')
