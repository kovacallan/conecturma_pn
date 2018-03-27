% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Mudar senha</h1>
            <form action="/new_nome_user" , method='post'>
                Nome  :<input type="text" name="usuario"/><br>
                Senha :<input type="password" name="senha"/><br>
                Novo nome de usuário :<input type="text" name="nome_novo"/><br>
                <br>
                <button type="submit">Entrar</button>
            </form>
            <a href="/user_menu">
            <button>Voltar</button>
        </a>
        </div>
    </div>
% include('footer.tpl')