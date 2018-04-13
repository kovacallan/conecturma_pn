<%
if observador_tipo is '0':
%>
<select id="filtro_escola">
    <option value="0">---- Selecione escola ----</option>
    % for e in escolas:
        <option value="{{e['id']}}">{{e['nome']}}</option>
    % end
</select>
<select id="filtro_rede">
    <option value="0">---- Selecione rede ----</option>
    % for r in redes:
        <option value="{{r['id']}}">{{r['nome']}}</option>
    % end
</select>
<select id="filtro_tipo_usuario">
    <option value="0">---- Selecione Tipo do usuário ----</option>
    <option value="1">Gestor</option>
    <option value="2">Diretor</option>
    <option value="3">Professor</option>
    <option value="6">Aluno</option>
</select>