% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Login</h1>
            <form action="/login_observador" method="post">
                <h2>Observador</h2>
                Nome  :<input type="text" name="usuario"/>
                Senha :<input type="password" name="senha"/>
                <button type="submit">Entrar</button>
            </form>
            <br>
            <a href=""><button>Esquici a senha</button></a>
            <br>
            <form action="/login_aluno" method="post">
                <h2>Aluno</h2>
                Nome  :<input type="text" name="usuario"/>
                Senha :<input type="password" name="senha"/>
                <button type="submit">Entrar</button>
            </form>
            <a href="/formulario_cadastro"><button>Cadastrar</button></a>
        </div>
    </div>
% include('footer.tpl')