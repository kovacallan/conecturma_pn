%include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>selecione oq fazer nos alunos</h1>

            <a href="/cadastro_aluno">
            <button>criar aluno</button>
            </a>

            <a href="/ler_aluno">
            <button>ver alunos</button>
            </a>

            <a href="/ver_itens_comprados">
            <button>Ver Itens Comprados</button>
            </a>

            <a href="/medalha_read">
            <button>ver medalhas do aluno<button>
            <a href="/">
            <button>Voltar</button>
            </a>
        </div>
    </div>
%include('footer.tpl')