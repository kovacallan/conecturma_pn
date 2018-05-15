% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Login</h1>
            <form action="login/login_observador" method="post">
                <h2>Observador</h2>
                Email  :<input type="text" name="observador_login_email"/>
                Senha :<input type="password" name="observador_senha"/>
                <button type="submit">Entrar</button>
            </form>
            <br>
            <a href="esqueci_senha"><button>Esquici a senha</button></a>
            <br>
            <form action="login/login_aluno" method="post">
                <h2>Aluno</h2>
                Nome  :<input type="text" name="aluno_login_nome"/>
                Senha :<input type="password" name="aluno_senha"/>
                <button type="submit">Entrar</button>
            </form>
            <a href="/formulario_cadastro"><button>Cadastrar</button></a>
        </div>
    </div>
% include('footer.tpl')