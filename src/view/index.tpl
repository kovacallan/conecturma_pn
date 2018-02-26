% include('header.tpl', title = 'Conecturma')
<<<<<<< HEAD
    <h1>Login</h1>
=======
    <h1>Bem vindo a Plataforma Conecturma</h1>
>>>>>>> 5c652c1c0467dbc1804ac86c818f8dccd1514b07
    <form action="/login" method="post">
        nome  :<input type="text" name="usuario"/>
        senha :<input type="password" name="senha"/>
        <br>
        <button type="submit">Entrar</button>
    </form>


    <a href="/cadastro_aluno"><button>Cadastrar</button></a>
% include('footer.tpl')