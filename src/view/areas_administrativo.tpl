% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Bem Vindo Administrador</h1>
            <h2>A Conecturma!</h2>
        </div>

        <div class="col-md-4">
            Nome
        </div>
        <div class="col-md-4">
            Tipo usuario
        </div>
        <div class="col-md-4">
            Data acesso
        </div>
        %for x in historico:
            <div class="col-md-4">
                {{x['nome']}}
            </div>
            <div class="col-md-4">
                {{x['tipo_usuario']}}
            </div>
            <div class="col-md-4">
                {{x['data_acesso']}}
            </div>
        %end


    </div>
% include('footer.tpl')