% if tipo is 0:
    nome*: <input type="text" name="nome"> <br><br>
    senha*: <input type="password" name="senha"> <br><br>
    telefone*:<input type="text" name="telefone"> <br><br>
    cpf*:<input type="text" name="cpf"> <br><br>
    email*:<input type="email" name="email" onChange="emailValidador()"><div id="erro_email"></div><br><br>
    <button type="submit">Enviar</button>

% elif tipo is 1:
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

% elif tipo is 2:
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
    <input type="hidden" id="turma" name="turma" value="0">
    <input type="hidden" id="rede" name="rede" value="0">

% elif tipo is 3:
    nome*: <input type="text" id="nome" name="nome"> <br><br>
    senha*: <input type="password" id="senha" name="senha"> <br><br>
    telefone:<input type="telefone" id="telefone" name="telefone"><br><br>
    <input type="hidden" id="cpf" name="cpf" value="0">
    email*:<input type="email" id="email" name="email" onChange="emailValidador()"><div id="erro_email"></div>
    <br><br>

    escola*:
    <select id="escola" name="escola">
        % for e in escola:
            <option value="{{e['id']}}">{{e['nome']}}</option>
        % end
    </select>
    <br>
    <br>
    Turma*:
    <select id="turma" name="turma">
        %for t in turma:
            <option value="{{t['id']}}">{{t['nome']}}</option>
        %end
    </select>
    <input type="hidden" id="rede" name="rede" value="0">
    <br>
% end