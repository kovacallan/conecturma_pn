% include('header.tpl', title = 'Conecturma')
    <div class="col-md-12">
        <div class="row">
            <div align="center" class="col-md-6">
                <h1>Bem Vindo {{usuario}} </h1>
                <h2>A Conecturma!</h2>
                <a href="/sair"><button>Sair</button></a>
            </div>
        </div>
        <%
            for x in historico:
        %>
        <div class="col-md-6">
            <div class="row">
                <div class="col-md-1">
                    {{x['nome']}}
                </div>
                <div class="col-md-1">
                    {{x['tipo']}}
                </div>
                <div class="col-md-3">
                    {{x['data']}}
                </div>
            </div>
            <br>
        </div>
            <%
            end
        %>
    </div>
% include('footer.tpl')