% include('./header.tpl', title = 'Conecturma')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Ver Observador</h1>
        <br>
        <table>
            <tr>
                <th>Nome </th><th>Telefone </th><th>cpf </th><th>Email </th><th>Tipo </th>
            </tr>
            % for observadores in observador:
            <tr>
                <td>
                    {{observadores['nome']}}
                </td>
                <td>
                    {{observadores['telefone']}}
                </td>
                <td>
                    {{observadores['cpf']}}
                </td>
                <td>
                    {{observadores['email']}}
                </td>
                <td>
                    {{observadores['tipo']}}
                </td>
                <td>
                    <form action="/observador/editar">
                        <button type="submit" name="nome" value="{{observadores['nome']}}">Editar</button>
                    </form>
                </td>
            </tr>
            %end
        </table>
        <a href="/observador">
            <button>voltar</button>
        </a>
    </div>
</div>
% include('./footer.tpl')