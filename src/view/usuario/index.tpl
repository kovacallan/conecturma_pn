%include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Listagem de Usuários</h1>
            <div class="row">
                <form action="usuario/redirect_cadastro">
                    <input type="radio" name="tipo_usuario" value="1">Gestor
                    <input type="radio" name="tipo_usuario" value="2">Diretor
                    <input type="radio" name="tipo_usuario" value="3">Professor
                    <input type="radio" name="tipo_usuario" value="6">Aluno
                    <button type="submit" >+ Usuário</button>
                </form>
            </div>
            <form action="/filtro_usuario" method="post">
                 <select name="filtro_escola">
                    % for i in escolas:
                        <option value="{{i['id']}}">{{i['nome']}}</option>
                    % end
                </select><br>
            <button type="submit">Enviar</button>
            </form>
            <div class="row">
                <div class="col-md-2">
                    Nome
                </div>
                <div class="col-md-2">
                    CPF
                </div>
                <div class="col-md-2">
                    Escola
                </div>
                <div class="col-md-2">
                    Rede
                </div>
                <div class="col-md-2">
                    Tipo
                </div>
            </div>
            <%
                for i in usuarios:
            %>
                <div class="row">

                    <div class="col-md-2">
                        {{i['nome']}}
                    </div>
                    <div class="col-md-2">
                        {{i['cpf']}}
                    </div>
                    <div class="col-md-2">
                        {{i['vinculo_escola']}}
                    </div>
                    <div class="col-md-2">
                        {{i['vinculo_rede']}}
                    </div>
                    <div class="col-md-2">
                        {{i['tipo']}}
                    </div>
                </div>

            <%
                end
            %>
        </div>
    </div>
%include('footer.tpl')