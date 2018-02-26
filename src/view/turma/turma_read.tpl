% include('./header.tpl', title = 'Conecturma')
    <div align="center" class="col-md-12">
        <h1>Ver Turmas</h1>
        <div class="row">
            <div class="col-md-4">
                <h4>ID</h4>
                % for id in turma_id:
                    {{id}}
                    <br><br>
                % end
            </div>
            <div class="col-md-4">
                <h4>Turma nome</h4>
                % for nome in turma_nome:
                    {{nome}}
                    <br><br>
                % end
            </div>
            <div class="col-md-4">
                <h4>Deletar Turma</h4>
            </div>
        </div>
        <a href="/user_menu"><button>Voltar</button></a>
    </div>

% include('./footer.tpl')