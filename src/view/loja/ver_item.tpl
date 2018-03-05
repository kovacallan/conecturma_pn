% include('./header.tpl', title = 'Conecturma')
   <div align="center" class="col-md-12">
        <h1>Alunos da turma:</h1>
        <h3>pesquisar aluno</h3>
        <input type="text" name="Nome" size="40" /><button type="submit">Pesquisar</button>
        <div class="row">
            %for itens in teste:
                <div class="col-md-3">
                    {{itens.id}}
                <br>
                </br>
                <div class="col-md-3">
                    {{itens.nome_item}}
                    <br>
                </div>
                <div class="col-md-3">
                    {{itens.tipo_item}}
                    <br>
                </div>
                <div class="col-md-3">
                    {{itens.preco_item}}
                    <br>
                </div>

            %end
        </div>
        <a href="/aluno"><button>Voltar</button></a>
   </div>

% include('footer.tpl')