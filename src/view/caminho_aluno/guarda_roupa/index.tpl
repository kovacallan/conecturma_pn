<! DOCTYPE html>
<html>
    <head>
        <title>Jogar Conecturma</title>
        <link rel="stylesheet" type="text/css" href="/static/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="/static/bootstrap.min.css.map">
        <link rel="stylesheet" type="text/css" href="/static/style_guarda_roupa.css">
    </head>    
    <body>
        <div class="bg_ground">
            <div class="container">
                <div class="row">
                    <div class="menu col-md-9 offset-md-2">
                        <ul>
                            <li class="c"></li>
                            <li class="ambiente"><a href="/"></a></li>
                            <li class="facebook offset-md-1"><a href="https://www.facebook.com/conecturmaoficial/"></a></li>
                            <li class="youtube offset-md-1"><a href="https://www.youtube.com/conecturma"></a></li>'
                            <li class="sair offset-md-1"><a href="/sair"></a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="opcoes_acessorios">
                                <div class="cores scale-bounce">
                                    <a onclick="mostrar_itens(1)" style="cursor:pointer;"></a>
                                </div>
                                <div class="rosto scale-bounce">
                                    <a onclick="mostrar_itens(2)" style="cursor:pointer;"></a>
                                </div>
                                <div class="acessorios scale-bounce">
                                    <a onclick="mostrar_itens(3)" style="cursor:pointer;"></a>
                                </div>
                                <div class="corpo scale-bounce">
                                    <a onclick="mostrar_itens(4)" style="cursor:pointer;"></a>
                                </div>
                            </div>
                        </div>
                        <div align="center" class="col-md-6">
                            <div class="avatar">
                                <div class="title">
                                </div>
                                <div class="avatar">
                                    <div id="avatar_usuario">
                                        %if cor != '0':
                                            <img id='avatar-itens-cor' src="/static/img/body/2{{cor['image_name']}}" class='avatar-itens-cor imagem-pocicao-"+color.slice(0,4)+"' style="z-index: 11; position: absolute; left: 100px; top: -9%;">
                                            <input id='avatar-itens-cor-id' type='hidden' value='{{cor["id"]}}'>
                                        %else:
                                            <img id="avatar" src="/static/img/body/avatar-naked.png">
                                            <input id='avatar-itens-cor-id' type='hidden' value='0'>
                                        %end

                                        %if rosto != '0':
                                            <img id='avatar-itens-rosto' src="/static/img/rosto/2{{rosto['image_name']}}" style="z-index: 12; position: absolute; top: -10%; left: 102px;">
                                            <input id='avatar-itens-rosto-id' type='hidden' value='{{rosto["id"]}}'>
                                        %else:
                                            <input id='avatar-itens-rosto-id' type='hidden' value='0'>
                                        %end

                                        %if acessorio != '0':
                                            <img src="/static/img/acessorio/{{acessorio['image_name']}}" style="z-index: 13; position: absolute; top: -10%; left: 98px;">
                                            <input id='avatar-itens-acessorios-id' type='hidden' value='{{acessorio["id"]}}'>
                                        %else:
                                            <input id='avatar-itens-acessorios-id' type='hidden' value='0'>
                                        %end

                                        %if corpo != '0':
                                            <img id='avatar-itens-body' src="/static/img/corpo/{{corpo['image_name']}}" style="z-index: 12; position: absolute;top: -9%;left: 103px;">
                                            <input id='avatar-itens-body-id' type='hidden' value='{{corpo["id"]}}'>
                                        %else:
                                            <input id='avatar-itens-body-id' type='hidden' value='0'>
                                        %end
                                    </div>
                                    <div class="space_ship">
                                        <img id="nave" src="/static/img/space_avatar.png">
                                        % if apelido != '0':
                                            <input id="apelido" type="text" name="apelido" value="{{apelido}}">
                                        % else:
                                            <input id="apelido" type="text" name="apelido" value="">
                                        % end
                                        <div class="botoes">
                                            <img onclick="salvar_avatar()" src="/static/img/btn-salvar.png" style="cursor:pointer;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="itens">
                                <img id="setaUp" src="/static/img/avatar-top-button.png">
                                <div id="item-comprado-cores" class="item-comprado-cores">
                                    %z = 0
                                    % for i in cores:
                                        % if z % 2 == 0:
                                            %if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/body/{{i['image_name']}}"></div>
                                            % else:
                                                <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/body/{{i['image_name']}}"></div>
                                            % end
                                        % else:
                                            %if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/body/{{i['image_name']}}"></div>
                                            %else:
                                                <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/body/{{i['image_name']}}"></div>
                                            %end
                                         % end
                                        %z += 1
                                    % end
                                </div>
                                <div id="item-comprado-rosto" class="item-comprado-rosto" style="display:none;">
                                    %z = 0
                                    % for i in rostos:
                                        % if z % 2 == 0:
                                            %if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/rosto/{{i['image_name']}}"></div>
                                            %else:
                                                <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/rosto/{{i['image_name']}}"></div>
                                            % end
                                        % else:
                                            % if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/rosto/{{i['image_name']}}"></div>
                                            % else:
                                                <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/rosto/{{i['image_name']}}"></div>
                                            % end

                                        % end
                                        %z += 1
                                    % end
                                </div>
                                <div id="item-comprado-acessorios" class="item-comprado-acessorios" style="display:none;">
                                    %z = 0
                                    % if acessorios != []:
                                        % for i in acessorios:
                                            % if z % 2 == 0:
                                                % if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_acessorios('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/acessorio/{{i['image_name']}}"></div>
                                                % else:
                                                    <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/acessorio/{{i['image_name']}}"></div>
                                                % end
                                            % else:
                                                % if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_acessorios('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/acessorio/{{i['image_name']}}"></div>
                                                % else:
                                                    <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/acessorio/{{i['image_name']}}"></div>
                                                % end
                                            % end
                                            %z += 1
                                        % end
                                    % end
                                </div>
                                <div id="item-comprado-corpo" class="item-comprado-corpo" style="display:none;">
                                    %z = 0
                                    % if corpos != []:
                                        % for i in corpos:
                                            % if z % 2 == 0:
                                                % if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_body('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/corpo/{{i['image_name']}}"></div>
                                                % else:
                                                    <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/corpo/{{i['image_name']}}"></div>
                                                % end

                                            % else:
                                                % if str(i['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_body('{{i['image_name']}}','{{i['id']}}')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/corpo/{{i['image_name']}}"></div>
                                                % else:
                                                    <div class="item-comprado-avatar scale-bounce" onclick="comprar_acessorio('{{i['id']}}')" style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/corpo/{{i['image_name']}}"></div>
                                                % end
                                            % end
                                            %z += 1
                                        % end
                                    % end
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script>
            var display=1;
            
            function flag_display_none(flag){
                switch(flag){
                    case 1:
                        document.getElementById('item-comprado-cores').style.display = "none"; 
                        break;
                    case 2:
                        document.getElementById('item-comprado-rosto').style.display = "none";
                        break;
                    case 3:
                        document.getElementById('item-comprado-acessorios').style.display = "none";
                        break;
                    case 4:
                        document.getElementById('item-comprado-corpo').style.display = "none";
                        break;
                } 
            }
            
            function mostrar_itens(tipo){
                switch(tipo){
                    case 1:
                        flag_display_none(display)
                        document.getElementById('item-comprado-cores').style.display = "block";
                        
                        display = 1 
                        break;
                    case 2:
                        flag_display_none(display)
                        document.getElementById('item-comprado-rosto').style.display = "block"; 
                        display = 2
                        break;
                    case 3:
                        flag_display_none(display)
                        document.getElementById('item-comprado-acessorios').style.display = "block"; 
                        display = 3
                        break;
                    case 4:
                        flag_display_none(display)
                        document.getElementById('item-comprado-corpo').style.display = "block"; 
                        display = 4
                        break; 
                }
            }    

            function comprar_acessorio(item){
                $.post('/comprar_item', {item:item},function(data){
                 });
            }

            function salvar_avatar(){
                $.post('/equipar_item', {avatar_cor:document.getElementById("avatar-itens-cor-id").value,avatar_rosto:document.getElementById("avatar-itens-rosto-id").value
                ,avatar_acessorios:document.getElementById("avatar-itens-acessorios-id").value,avatar_body:document.getElementById("avatar-itens-body-id").value, apelido:document.getElementById("apelido").value},function(data){
                    window.location.replace("/");
                 });
            }

            var flag_rosto = 0;
            function change_avatar_color(color, id){
                color=color.toLowerCase();
                $("#avatar-itens-cor").remove();
                $("#avatar-itens-cor-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-cor-id' type='hidden' value='"+id+"'><img id='avatar-itens-cor' src='/static/img/body/"+color+"' value='teste' class='avatar-itens-cor imagem-pocicao-"+color.slice(0,4)+"' style='z-index: 11;'>");
            }
            function change_avatar_face(face, id){
                face=face.toLowerCase();
                $("#avatar-itens-rosto").remove();
                $("#avatar-itens-rosto-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-rosto-id' type='hidden' value='"+id+"'><img id='avatar-itens-rosto' src='/static/img/rosto/"+face+"' class='avatar-itens-rosto imagem-pocicao-"+face.slice(0,8)+"' style='z-index: 12;'>");
            }
            function change_avatar_acessorios(acessorios, id){
                acessorios=acessorios.toLowerCase();
                $("#avatar-itens-acessorios").remove();
                $("#avatar-itens-acessorios-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-acessorios-id' type='hidden' value='"+id+"'><img id='avatar-itens-acessorios' src='/static/img/acessorio/"+acessorios+"' class='avatar-itens-acessorio imagem-pocicao-"+acessorios.slice(0,10)+"' style='z-index: 13;'>");
            }
            function change_avatar_body(body, id){
                body=body.toLowerCase();
                $("#avatar-itens-body").remove();
                $("#avatar-itens-body-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-body-id' type='hidden' value='"+id+"'><img id='avatar-itens-body' src='/static/img/corpo/"+body+"' class='avatar-itens-corpo' style='z-index: 12;'>");
            }
        </script>
    </body>
</html>