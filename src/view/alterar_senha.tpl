% include('gestao_aprendizagem/header/header.tpl', title = 'Conecturma', css="css-listagem-escolas.css")
    <div class="row">
        <div align="center" class="col-md-8">
            <h2 class="mudar_senha">Mudar senha</h2>
            <form action="/novasenha" , method='post'>
                <div class="offset-md-4 row" style="padding-left:26px">
                <input  type="hidden" name="id" value="{{id}}"/>
                <input type="hidden" name="email" value="{{email}}"/>
                Senha nova <input class="offset-md-3" size="30"  style="border: 1px black solid;" type="password" name="senha_nova"/><br/>
                </div>
                <br>
                <div class="offset-md-4 row" style="padding-left:26px;margin-top:-8px">
                Confirme a nova senha<input style="margin-left: 54px;border: 1px black solid;" size="30" type="password" name="senha_conf"/>
                </div>
                <br>
                <div class="row">
                    <div class="offset-md-7 col-md-2">
                        <a style="background-color:#ff4d4d;margin-left:33px;" href="/" class="botao-nova-escola">
                  &nbsp;        Cancelar
                        </a>
                    </div>
                    <div class="col-md-2" style="padding-left: 30px;">
                        <button type="submit" class="botao-nova-escola">
                  &nbsp;        Mudar senha
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
% include('gestao_aprendizagem/footer/footer.tpl')