% include('./header.tpl', title = 'Conecturma')
    <div align="center" class="col-md-12">
        <h1>Incluir Aluno em Turma</h1>
        <div class="row">
            <div class="col-md-3">
            <form action="/turma_aluno">
                <h4>ID</h4>
                % for id in turma_id:
                    <input type="radio" name="{{turma_id}}">{{id}}
                    <br><br>
                % end
            </div>
            <div class="col-md-3">
                <h4>Turma nome</h4>
                % for nome in turma_nome:
                    {{nome}}
                    <br><br>
                % end
            </div>
            <div class="col-md-3">
                <h4>Quem criou</h4>
                % for criador in criador:
                    {{criador}}
                    <br><br>
                % end
            </div>
            </form>
        </div>
            <button type="submit" name="submit" >Selecionar uma turma para esses alunos</button>
        </form>
         <a href="/aluno">
            <button>Voltar</button>
        </a>
    </div>

% include('./footer.tpl')