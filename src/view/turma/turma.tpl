% include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
           <h1>Turmas</h1>
            <a href="/turma_cadastro"><button>Cadastro turma</button></a>
            <a href="/turma_read"><button>Ver turma</button></a>
            <a href="/"><button>Voltar</button></a>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-2">
                </div>
                <div class="col-md-2">
                    Nome
                </div>
                <div class="col-md-2">
                    Professor(es)
                </div>
                <div class="col-md-2">
                    Escola
                </div>
                <div class="col-md-2">
                    Série
                </div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    {{turma}}
                </div>
                <div class="col-md-2">
                    Nome
                </div>
                <div class="col-md-2">
                    Professor(es)
                </div>
                <div class="col-md-2">
                    Escola
                </div>
                <div class="col-md-2">
                    Série
                </div>
            </div>
        </div>
    </div>

% include('./footer.tpl')