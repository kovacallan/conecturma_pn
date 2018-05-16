from walrus import *
from facade.aluno_facade import AlunoFacade
from facade.historico_facade import HistoricoFacade
from facade.loja_facade import LojaFacade
from facade.medalha_facade import MedalhaFacade
from facade.observador_facade import ObservadorFacade
from facade.estrutura_facade import EstruturaFacade
from facade.zInativos_facade import ZinativosFacade


class Facade(AlunoFacade, ObservadorFacade, HistoricoFacade, LojaFacade, MedalhaFacade, EstruturaFacade, ZinativosFacade):
    def __init__(self):
        super(Facade, self).__init__()
        # # super(ObservadorFacade, self).__init__()
        ObservadorFacade.__init__(self)
        EstruturaFacade.__init__(self)
        LojaFacade.__init__(self)
        HistoricoFacade.__init__(self)
        MedalhaFacade.__init__(self)
        ZinativosFacade.__init__(self)

