% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Login</h1>
            <form action="/login" method="post">
                Nome  :<input type="text" name="usuario"/><br>
                Senha :<input type="password" name="senha"/>
                <br>
                <button type="submit">Entrar</button>
            </form>
            <a href="/formulario_cadastro"><button>Cadastrar</button></a>
        </div>
    </div>
% include('footer.tpl')