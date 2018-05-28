% include('header.tpl', title = 'Conecturma')
        <div align="center" class="col-md-12">
            <h1>Bem Vindo Administrador</h1>
            <h2>A Conecturma!</h2>
        </div>
            <div class="row">
                <div class="col-md-4">
                    <h4>Menu</h4>
                    <ul>
                        <li><a>Medalhas</a></li>
                        <li><a>Itens</a></li>
                        <li><a>Descritores</a></li>
                    </ul>
                </div>
                <div class="col-md-2 offset-md-2">
                Nome
                </div>
                <div class="col-md-2">
                    Tipo usuario
                </div>
                <div class="col-md-2">
                    Data acesso
                </div>

            </div>
            %for x in historico:
                <div class="row">
                    <div class="col-md-2 offset-md-6">
                        {{x['nome']}}
                    </div>
                    <div class="col-md-2">
                        {{x['tipo_usuario']}}
                    </div>
                    <div class="col-md-2">
                        {{x['data_acesso']}}
                    </div>
                </div>
            %end

% include('footer.tpl')