% include('./header.tpl', title = 'Conecturma')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Cadastro</h1>
        <br>
        <form action="create_observador_professor" method="post"> <br>
            <input type="hidden" name="tipo_observador" value="{{tipo}}">
            nome*: <input type="text" name="nome"> <br>
            senha*: <input type="password" name="senha"> <br>
            telefone:<input type="text" name="telefone" value=" "><br>
            email*:<input type="email" name="email"> <br>
            escola*:
            <select name="escola">
                % for e in escola:
                    <option value="{{e['id']}}">{{e['nome']}}</option>
                % end
            </select>
            <br>
            <button type="submit">Enviar</button>
        </form>
        <a href="/gestao_aprendizagem/usuario"><button>Voltar</button></a>
    </div>
</div>
% include('./footer.tpl')