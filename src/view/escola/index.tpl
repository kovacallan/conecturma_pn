%include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Escola</h1>
            <a href="/escola/cadastro">
                <button>criar escola</button>
            </a>
            <a href="/">
                <button>Voltar</button>
            </a>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-2">
                </div>
                <div class="col-md-3">
                    Nome
                </div>
                <div class="col-md-3">
                    Rede
                </div>
                <div class="col-md-3">
                    Cod_escola
                </div>
            </div>
            % for e in escola:
            <div class="row">
                <div class="col-md-2">

                </div>
                <div class="col-md-3">
                    {{e['nome']}}
                </div>
                <div class="col-md-3">
                    {{e['rede']}}
                </div>
                <div class="col-md-3">
                    {{e['nome']}}
                </div>
            </div>
            % end

        </div>
    </div>
%include('footer.tpl')