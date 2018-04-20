%include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Listagem de Usuários</h1>

                % if observador_tipo == '3':
                    <div class="col-md-4">
                        <div class="row">
                            <form action="usuario/redirect_cadastro">
                                <input type="radio" name="tipo_usuario" value="6">Aluno
                                <button type="submit" >+ Usuário</button>
                            </form>

                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-2">
                            <strong>Nome</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>CPF</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Escola</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Rede</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Tipo</strong>
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
                % elif observador_tipo == '2':
                    <div class="col-md-4">
                        <div class="row">
                            <form action="usuario/redirect_cadastro">
                                <input type="radio" name="tipo_usuario" value="3">Professor
                                <input type="radio" name="tipo_usuario" value="6">Aluno
                                <button type="submit" >+ Usuário</button>
                            </form>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-2">
                            <strong>Nome</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>CPF</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Escola</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Rede</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Tipo</strong>
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
                % elif observador_tipo == '1':
                    <div class="col-md-4">
                        <div class="row">
                            <form action="usuario/redirect_cadastro">
                                <input type="radio" name="tipo_usuario" value="2">Diretor
                                <input type="radio" name="tipo_usuario" value="3">Professor
                                <input type="radio" name="tipo_usuario" value="6">Aluno
                                <button type="submit" >+ Usuário</button>
                            </form>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-2">
                            <strong>Nome</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>CPF</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Escola</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Rede</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Tipo</strong>
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
                % elif observador_tipo is '0':
                         <div class="col-md-4">
                            <div class="row">
                                <form action="usuario/redirect_cadastro">
                                    <input type="radio" name="tipo_usuario" value="1">Gestor
                                    <input type="radio" name="tipo_usuario" value="2">Diretor
                                    <input type="radio" name="tipo_usuario" value="3">Professor
                                    <input type="radio" name="tipo_usuario" value="6" checked=true>Aluno
                                    <button type="submit" >+ Usuário</button>
                                </form>
                            </div>
                        </div>
                        <div class="col-md-8">
                        <div class="row">
                            <form action="/usuario/filtro_usuario" method="post">
                                <select name="filtro_escola">
                                    <option value="0">---- Selecione escola ----</option>
                                    % for e in escolas:
                                        <option value="{{e['id']}}">{{e['nome']}}</option>
                                    % end
                                </select>
                                <select name="filtro_rede">
                                    <option value="0">---- Selecione rede ----</option>
                                    % for r in redes:
                                        <option value="{{r['id']}}">{{r['nome']}}</option>
                                    % end
                                </select>
                                <select name="filtro_tipo_usuario">
                                    <option value="0">---- Selecione Tipo do usuário ----</option>
                                    <option value="1">Gestor</option>
                                    <option value="2">Diretor</option>
                                    <option value="3">Professor</option>
                                    <option value="6">Aluno</option>
                                </select>
                                <button type="submit">Filtrar</button>
                            </form>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-2">
                            <strong>Nome</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>CPF</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Escola</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Rede</strong>
                        </div>
                        <div class="col-md-2">
                            <strong>Tipo</strong>
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
                % end
        </div>
<a href="/">
                             <button>voltar</button>
                            </a>
                        </div>
    </div>
%include('footer.tpl')