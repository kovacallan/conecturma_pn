% include('./header.tpl', title = 'Conecturma')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Cadastro</h1>
        <br>
        <form action="create_medalha"> <br>
            nome: <input type="text" name="nome"/> <br>
            <button type="submit">Enviar</button>
        </form>
        <a href="/gestao_aprendizagem">
            <button>voltar</button>
        </a>
    </div>
</div>
% include('./footer.tpl')