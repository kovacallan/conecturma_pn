% include('./header.tpl', title = 'Conecturma')
    <div align="center" class="col-md-12">
        <h1>Alunos da turma:</h1>

        <h3>pesquisar aluno</h3>
        <div>
            <form action="/turma_aluno" >
                <table>
                    <tr>
                        <th>Nome do Aluno</th><th>Matricula</th><th>id da turma que pertence</th>
                    </tr>

                        % for id, aluno, matricula, turma_do_aluno in aluno_id:
                    <tr>
                        <td>
                            <input type="checkbox" name="aluno_{{id}}">{{aluno}}</input>
                        </td>
                        <td>
                            {{matricula}}
                        </td>
                        <td>
                            {{turma_do_aluno}}
                        </td>
                        <td>
                    </tr>
                        % end
                </table>
        </div>

        <select name="escolhidos">
        % for turma in turmas:
        <option value="{{turma['id']}}">{{turma['nome']}}</option>

            % end
        </select>
        <button type="submit" name ="colocar_na_turma">inscrever alunos em turma</button>

        <button type="submit" name ="deletar_da_turma" formaction="/deletar_alunos">deletar alunos selecionados</button>


        </form>
        <a href="/user_menu">
        <button>Voltar</button>
        </a>
    </div>
% include('footer.tpl')