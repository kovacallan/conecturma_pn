% include('gestao_aprendizagem/header/header.tpl', title = 'Conecturma', css="css-listagem-escolas.css")
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Mudar senha</h1>
            <form action="/novasenha" , method='post'>
                <input type="hidden" name="id" value="{{id}}"/>
                <input type="hidden" name="email" value="{{email}}"/>
                Senha nova :<input type="password" name="senha_nova"/><br>
                Confirme a nova senha:<input type="password" name="senha_conf"/><br>
                <br>
                <button type="submit">Salvar</button>
            </form>
        </div>
    </div>
% include('footer.tpl')