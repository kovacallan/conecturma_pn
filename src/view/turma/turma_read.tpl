% include('./header.tpl', title = 'Conecturma')
    <div align="center" class="col-md-12">
        <h1>Ver Turmas</h1>
        <div class="row">
            <div class="col-md-3">
                <h4>ID</h4>
                % for id in turma_id:
                    {{id}}
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
            <div class="col-md-3">
                <form action="/deletar_turma">
                <h4>Deletar Turma</h4>
                % for id in turma_id:
                    <button name="id" value="{{id}}">Deletar</button>
                    <br><br>
                % end
                </form>
            </div>
        </div>
        <a href="/turma"><button>Voltar</button></a>
    </div>

% include('./footer.tpl')