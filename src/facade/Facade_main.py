from walrus import *
from facade.aluno_facade import AlunoFacade
from facade.escola_facade import EscolaFacade
from facade.historico_facade import HistoricoFacade
from facade.loja_facade import LojaFacade
from facade.medalha_facade import MedalhaFacade
from facade.observador_facade import ObservadorFacade
from facade.rede_facade import RedeFacade
from facade.turma_facade import TurmaFacade


class Facade(AlunoFacade, ObservadorFacade, EscolaFacade, HistoricoFacade, LojaFacade, MedalhaFacade, RedeFacade,
             TurmaFacade):
    def __init__(self):
        super(Facade, self).__init__()
        # # super(ObservadorFacade, self).__init__()
        ObservadorFacade.__init__(self)
        RedeFacade.__init__(self)
        TurmaFacade.__init__(self)
        LojaFacade.__init__(self)
        EscolaFacade.__init__(self)
        HistoricoFacade.__init__(self)
        MedalhaFacade.__init__(self)

    # def apagartudo(self):
    #     return self.darflush()