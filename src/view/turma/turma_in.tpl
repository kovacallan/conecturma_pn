%include('header.tpl', title="Conecturma")
<div align="center" class="col-md-12">
        <h1>Ver alunos da turma</h1>
        <div>
        <table>
        <tr>
                <th>{{nome_turma}}</th>
                </tr>
            <%
                for x in alunos:
            %>
            <tr>
                <td>
                {{x['nome']}}

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