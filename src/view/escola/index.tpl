%include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Escola</h1>

            <a href="/escola/cadastro">
            <button>criar escola</button>
            </a>

            <a href="escola/read_escola">
            <button>ver escolas cadastradas</button>
            </a>

            <a href="/">
            <button>Voltar</button>
            </a>
        </div>
    </div>
%include('footer.tpl')