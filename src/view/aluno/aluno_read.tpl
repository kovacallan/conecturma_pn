% include('./header.tpl', title = 'Conecturma')
   <div align="center" class="col-md-12">
        <h1>Alunos da turma:</h1>

        <h3>pesquisar aluno</h3>
        <div>
        <h4>Id</h4>
        <form action="/turma_aluno">
        <table>
        <tr>
        <th>Nome do Aluno</th><th>Matricula</th><th>Apagar</th>
        </tr>

                % for id, aluno, matricula in aluno_id:
                <tr>
                    <td>
                    <input type="checkbox" name="aluno_{{id}}">{{aluno}}</input>
                    </td>
                    <td>
                    {{matricula}}
                    </td><td>

                </tr>
                % end
        </table>
        </div>

 <select name="escolhidos">
 % for turma in turmas:
  <option value="{{turma['id']}}">{{turma['nome']}}</option>

 % end
</select>
               <button type="submit"  value="deletar">Apagar</button></td>
               <button type="submit" name ="colocar_na_turma" >inscrever alunos em turma</button>

            </form>
         <a href="/user_menu">
            <button>Voltar</button>
        </a>
   </div>

% include('footer.tpl')