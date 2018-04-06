% include('./header.tpl', title = 'Conecturma')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Ver medalhas</h1>
        <br>
        <table>
            <tr>

            </tr>
            % for medalhas in medalhas:
            <tr>
                <td>
                {{medalhas['id']}}
                </td>
                <td>
                    {{medalhas['nome']}}
                </td>
                <td>

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