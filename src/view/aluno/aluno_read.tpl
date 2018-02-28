% include('./header.tpl', title = 'Conecturma')
   <div align="center" class="col-md-12">
        <h1>Ver Alunos</h1>

        <div class="row">

            <div class="col-md-2 offset-2">
                <h4>Id</h4>
                % for id in aluno_id:
                    {{id}}
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
                 <h4>Senha</h4>
                % for senha_aluno in senha_aluno:
                    {{senha_aluno}}
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
        <a href="/aluno"><button>Voltar</button></a>
   </div>

% include('footer.tpl')