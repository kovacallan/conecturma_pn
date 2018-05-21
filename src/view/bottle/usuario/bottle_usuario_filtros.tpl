

    <select id="filtro_rede" onchange='potaquepariu()' >
        %if observador_tipo is '0':
            <option value="0">---- Selecione rede ----</option>
            % for r in redes:
                <option value="{{r['id']}}" >{{r['nome']}}</option>
            % end
        %elif redes == None or redes == '':
            <option value="0">---- Selecione rede ----</option>
        %else:
            <option value="{{redes['id']}}">{{redes['nome']}}</option>
        %end
    </select>
    <script>
    function potaquepariu(){
    window.alert("foi?,rede");
    filtro_escola = document.getElementById('filtro_escola').value;
    filtro_rede = document.getElementById('filtro_rede').value;
    filtro_turma =  document.getElementById('filtro_turma').value;
    filtro_tipo_usuario =  document.getElementById('filtro_tipo_usuario').value;

   $.post('/filtro_usuario', {escola:filtro_escola, rede:filtro_rede, turma:filtro_turma,tipo_usuario:filtro_tipo_usuario},function(data){
        $('#usuarios_sistema').html(data);
});
    }
    </script>

    <select class="teste" id="filtro_escola">
        %if observador_tipo is '0':
            <option value="0" >---- Selecione escola ----</option>
            % for e in escolas:
                <option value="{{e['id']}}" onChange="filtro_usuario()">{{e['nome']}}</option>
            % end
        %elif escolas == None or escolas == '':
            <option value="0">---- Selecione escola ----</option>
        %else:
            <option value="{{escolas['id']}}">{{escolas['nome']}}</option>
        %end
    </select>
    <select id="filtro_turma" onChange="filtro_usuario()">
        <option value="0">---- Selecione turma ----</option>
        <div id=usuarios_sistema>
        % for t in turmas:
            <option value="{{t['id']}}">{{t['nome']}}</option>
        % end
        </div>
    </select>
    <select id="filtro_tipo_usuario">
        <option value="0">---- Selecione Tipo do usuário ----</option>
        <option value="1">Gestor</option>
        <option value="2">Diretor</option>
        <option value="3">Professor</option>
        <option value="6">Aluno</option>
    </select>

