% include('./header.tpl', title = 'Conecturma')
   <div align="center" class="col-md-12">
        <h1>Alunos da turma:</h1>

        <h3>pesquisar aluno</h3>
        <div class="row">
            <div class="col-md-2 offset-2">
                <h4>Id</h4>
                % for id in aluno_id:
                <input type="checkbox" name="aluno_id" value = '{{id}}'>{{id}}
                    <br>
                    <br>
                % end
            </div>
            <div class="col-md-2">
                <h4>Matricula</h4>
                % for aluno_matricula in aluno_matricula:
                    {{aluno_matricula}}
                    <br>
                    <br>
                % end
            </div>

            <div class="col-md-2">
                <h4>Nome</h4>
                % for aluno_nome in aluno_nome:
                    {{aluno_nome}}
                    <br>
                    <br>
                % end
            </div>
            <div class="col-md-2">
                <h4>Deletar</h4>
                <form action="/deletar_alunos">
                % for id in aluno_id:
                    <button name="id" value="{{id}}">Apagar</button>
                    <br>
                    <br>
                %end
                </form>
            </div>
         </div>
            <form action="/turma_aluno">

                % for id in aluno_id:
                <input id ={{id}} type="checkbox" name="aluno_id[]" value="20">{{id}}
                    <br>
                    <br>
                % end

                <button type="submit" name ="aluno_id[]" value="20" >inscrever alunos em turma</button>
            </form>
         <a href="/user_menu">
            <button>Voltar</button>
        </a>
   </div>

% include('footer.tpl')