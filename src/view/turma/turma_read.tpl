% include('./header.tpl', title = 'Conecturma')
<div align="center" class="col-md-12">
        <h1>Ver turmas</h1>
        <div>
        <table>
                    <tr>
                        <th>Nome da turma</th><th>criador</th><th>desempenho_j1</th><th>desempenho_j2</th>
                    </tr>

                        % for id, nome, criador, desempenho_j1,desempenho_j2 in turma:
                    <tr>
                        <td>
                            {{nome}}
                        </td>
                        <td>
                            {{criador}}
                        </td>
                        <td>
                            {{desempenho_j1}}
                        </td>
                        <td>
                        {{desempenho_j2}}
                        </tb><td>
                    </tr>
                        % end
                </table>
        </div>
        <a href="/turma"><button>Voltar</button></a>
    </div>

% include('./footer.tpl')