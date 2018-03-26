% include('./header.tpl', title = 'Conecturma')
<div align="center" class="col-md-12">
        <h1>Ver turmas</h1>
        <div>
        <table>
        <tr>
                <th>Nome da turma</th><th>Criador</th>
                </tr>
            <%
                for x in turma:
            %>
            <tr>
                <td>
                {{x['nome']}}
                </td>

                <td>

                {{x['criador']}}
                </td><td>
                {{x['desempenho_j1']}}
                </td><td>
                {{x['desempenho_j2']}}
                </td>
            </tr>
           <%
                end
           %>
           </table>
        </div>
        <a href="/turma"><button>Voltar</button></a>
    </div>

% include('./footer.tpl')