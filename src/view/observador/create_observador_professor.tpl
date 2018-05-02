% include('./header.tpl', title = 'Professor')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Cadastro</h1>
        <br>
        <input type="hidden" name="tipo_observador" value="{{tipo}}">
        nome*: <input type="text" id="nome" name="nome"> <br><br>
        senha*: <input type="password" id="senha" name="senha"> <br><br>
        telefone:<input type="telefone" id="telefone" name="telefone"><br><br>
        email*:<input type="email" id="email" name="email" onChange="emailValidador()"> <br><br>
        escola*:
        <select id="escola" name="escola">
            % for e in escola:
                <option value="{{e['id']}}">{{e['nome']}}</option>
            % end
        </select>
        <br>
        <button onclick="cadastro_observador()">Enviar</button>
    </div>
</div>
% include('./footer.tpl')