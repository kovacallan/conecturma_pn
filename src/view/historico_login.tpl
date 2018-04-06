% include('header.tpl', title = 'Conecturma')
    <h1>Historico de login Observador </h1>
<%
    for x in historico:
%>
    <div class="row">
        <div class="col-md-1 offset-3">
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
<%
    end
%>
%include('footer.tpl')