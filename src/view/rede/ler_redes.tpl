% include('./header.tpl', title = 'Conecturma')
 <div>
                <table>
                    <tr>
                        <th>ID</th><th>Nome da rede</th><th>COD</th><th>telefone</th>
                    </tr>

                        % for id,nome,cod,telefone in rede_id:
                    <tr>
                        <td>
                            {{id}}
                        </td>
                         <td>
                            {{nome}}
                        </td>
                        <td>
                            {{cod}}
                        </td>
                        <td>
                            {{telefone}}
                        </td>
                        <td>
                    </tr>
                        % end
                </table>
                <a href="/rede"><button>Voltar</button></a>
        </div>
% include('./header.tpl', title = 'Conecturma')