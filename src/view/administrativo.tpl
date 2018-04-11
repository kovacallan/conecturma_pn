% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-6">
            <h1>Bem Vindo Administrador </h1>
            <h2>A Conecturma!</h2>
        <form action="/pesquisar_aluno">
            nome do estudante:<br>
        <input type="text" name="nome_do_aluno" value="nome do estudante">
        <br>
            turma:<br>
        <input type="text" name="nome_da_turma" value="escola">
        <br><br>
        <input type="submit" value="Pesquisar">
        </form>


            <a href="/sair"><button>Sair</button></a>
        </div>
    </div>
% include('footer.tpl')