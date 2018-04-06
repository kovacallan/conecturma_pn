% include('./header.tpl', title = 'Conecturma')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Cadastro</h1>
        <br>
        <form action="create_observador_administrador"> <br>
            <input type="hidden" name="tipo_observador" value="{{tipo}}">
            nome*: <input type="text" name="nome"> <br>
            senha*: <input type="password" name="senha"> <br>
            telefone*:<input type="text" name="telefone"> <br>
            cpf*:<input type="text" name="cpf"> <br>
            email*:<input type="email" name="email"> <br>
            <button type="submit">Enviar</button>
        </form>
        <a href="/observador">
            <button>voltar</button>
        </a>
    </div>
</div>
% include('./footer.tpl')