% include('header.tpl', title = 'Conecturma')

    <h1>Login</h1>

    <h1>Bem vindo a Plataforma Conecturma</h1>

    <form action="/login" method="post">
    nome :<input type="text" name="usuario"/>
    senha :<input type="password" name="senha"/>
    <br>
    <button type="submit">Entrar</button>
    </form>


    <a href="/cadastro_aluno">
    <button>Cadastrar</button>
    </a>
% include('footer.tpl')