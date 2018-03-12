% include('./header.tpl', title = 'Conecturma')
    <div align="center" class="col-md-12">
        <h1>Ver turmas</h1>
        <div class="row">
            <%
                for x in turma:
            %>
                {{x['id']}}
                {{x['nome']}}
                {{x['criador']}}<br>
           <%
                end
           %>
        </div>
        <a href="/turma"><button>Voltar</button></a>
    </div>

% include('./footer.tpl')