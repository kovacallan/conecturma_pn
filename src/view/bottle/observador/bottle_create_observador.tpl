% if tipo is '0':
    nome*: <input type="text" name="nome"> <br><br>
    senha*: <input type="password" name="senha"> <br><br>
    telefone*:<input type="text" name="telefone"> <br><br>
    cpf*:<input type="text" name="cpf"> <br><br>
    email*:<input type="email" name="email" onChange="emailValidador()"><div id="erro_email"></div><br><br>
    <button type="submit">Enviar</button>

% elif tipo is '1':
    nome*: <input type="text" id="nome" name="nome"> <br><br>
    senha*: <input type="password" id="senha" name="senha"> <br><br>
    telefone*:<input type="text" id="telefone" name="telefone"> <br><br>
    cpf*:<input type="text" id="cpf" name="cpf"> <br><br>
    email*:<input type="email" id="email" name="email" onChange="emailValidador()"><div id="erro_email"></div><br><br>
    <input type="hidden" id="escola" name="escola" value="0">
    <input type="hidden" id="turma" name="turma" value="0">
    rede*:
    <select id="rede" name="rede">
        % for e in rede:
            <option value="{{e['id']}}">{{e['nome']}}</option>
        % end
    </select>

% elif tipo is '2':
    nome*: <input type="text" id="nome" name="nome"> <br><br>
    senha*: <input type="password" id="senha" name="senha"> <br><br>
    telefone*:<input type="text" id="telefone" name="telefone"> <br><br>
    cpf*:<input type="text" id="cpf" name="cpf"> <br><br>
    email*:<input type="email" id="email" name="email" onChange="emailValidador()"><div id="erro_email"></div>
    <br><br>

    escola*:
    <select id="escola" name="escola">
        % for e in escola:
            <option value="{{e['id']}}">{{e['nome']}}</option>
        % end
    </select>
    <h3>Endereço</h3>
    Logradouro: <input type="text" name="logradouro"/>
    Numero: <input type="text" name="numero"/>
    Complemento : <input type="text" name="complemento"/><br>
    Bairro: <input type="text" name="bairro"/><br>
    CEP: <input type="text" name="cep"/>
    Uf:
            <select name="uf">
                <option value="">-- Selecione --</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Rorâima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
            </select><br>
    Municipio: <input type="text" name="municipio" id="municipio"/><br>
    <input type="hidden" id="turma" name="turma" value="0">
    <input type="hidden" id="rede" name="rede" value="0">

% elif tipo is '3':
    nome*: <input type="text" id="nome" name="nome"> <br><br>
    senha*: <input type="password" id="senha" name="senha"> <br><br>
    telefone:<input type="text" id="telefone" name="telefone"><br><br>
    <input type="hidden" id="cpf" name="cpf" value="0">
    email*:<input type="email" id="email" name="email" onChange="emailValidador()"><div id="erro_email"></div>
    <br><br>

    escola*:
    <select id="escola" name="escola">
        %if isinstance(escola,dict):
            <option value="{{escola['id']}}">{{escola['nome']}}</option>
        %else:
            % for e in escola:
                <option value="{{e['id']}}">{{e['nome']}}</option>
            % end
        %end
    </select>
    <br>
    <br>
    Turma*:
    <select id="turma" name="turma">
        <option value="0"> </option>
        %for t in turma:
            <option value="{{t['id']}}">{{t['nome']}}</option>
        %end
    </select>
    <h3>Endereço</h3>
    Logradouro: <input type="text" name="logradouro"/>
    Numero: <input type="text" name="numero"/>
    Complemento : <input type="text" name="complemento"/><br>
    Bairro: <input type="text" name="bairro"/><br>
    CEP: <input type="text" name="cep"/>
    Uf:
            <select name="uf">
                <option value="">-- Selecione --</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Rorâima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
            </select><br>
    Municipio: <input type="text" name="municipio" id="municipio"/><br>
    <input type="hidden" id="rede" name="rede" value="0">
    <br>
% end