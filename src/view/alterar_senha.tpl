% include('gestao_aprendizagem/header/header.tpl', title = 'Conecturma', css="css-listagem-escolas.css")
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Mudar senha</h1>
            <form action="/novasenha" , method='post'>
                <div class="offset-md-4 row">
                <input type="hidden" name="id" value="{{id}}"/>
                <input type="hidden" name="email" value="{{email}}"/>
                Senha nova <input type="password" name="senha_nova"/><br/>
                </div>
                <br>
                <div class="offset-md-3 row" style="padding-left:30px;">
                Confirme a nova senha<input type="password" name="senha_conf"/>
                </div>
                <br>
                <button type="submit">Salvar</button>

            </form>
        </div>
    </div>
% include('footer.tpl')