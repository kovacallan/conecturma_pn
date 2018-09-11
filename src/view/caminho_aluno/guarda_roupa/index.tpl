<! DOCTYPE html>
<html>
    <head>
        <title>Jogar Conecturma</title>
        <link rel="stylesheet" type="text/css" href="/static/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="/static/bootstrap.min.css.map">
        <link rel="stylesheet" type="text/css" href="/static/style_loja.css">
    </head>    
    <body>
        <div class="bg_ground">
            <div class="container">
                <div class="row">
                    <div class="menu col-md-9 offset-md-2">
                        <ul>
                            <li class="c"></li>
                            <li class="ambiente"><a href="#"></a></li>
                            <li class="facebook offset-md-1"><a href="#"></a></li>
                            <li class="youtube offset-md-1"><a href="#"></a></li>'
                            <li class="sair offset-md-1"><a href="#"></a></li>
                        </ul>
                    </div>
                </div>
                <div class="row" style="margin-top: 20px;">
                    <div class="col-md-4">
                        <div class="cristais">
                            <img src="/static/img/total_cristais_loja.png">
                        </div>
                        <div class="loja_space_avatar">
                             % if apelido != '0':
                                    <input id="apelido" type="text" name="apelido" value="{{apelido}}" style="beckground-color: #e75619;font-family: 'arial';color: #fff;border: 1px solid #ff8039;border-radius: 8px;height: 45px;width: 190px;padding: 0 0;font-size: 30px;text-shadow: 2px 2px #58210a;text-align: center;position: absolute;top: 41%;margin-left: 29%;">
                                % else:
                                    <input id="apelido" type="text" name="apelido" value="" style="beckground-color: #e75619;font-family: 'arial';color: #fff;border: 1px solid #ff8039;border-radius: 8px;height: 45px;width: 190px;padding: 0 0;font-size: 30px;text-shadow: 2px 2px #58210a;text-align: center;position: absolute;top: 41%;margin-left: 29%;>
                                % end
                        </div>
                        <div class="loja_avatar">
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
                            </div>
                        </div>
                        <!--<div class="botao-editar-avatar">
                            <a href="#">
                                <img src="img/btn_voltar.png">
                            </a>
                        </div>-->
                        <!--<div class="loja-luz-nave">
                        </div>-->
                    </div>
                    <div class="col-md-8">
                        <div class="loja-categorias">
                                <div class="row">
                                    <div id="cor" class="cores scale-bounce"><a onclick="mostrar_itens(1)" style="cursor:pointer;"></a></div>
                                    <div id="rosto" class="rosto scale-bounce"><a onclick="mostrar_itens(2)" style="cursor:pointer;"></a></div>
                                    <div id="acessorios" class="acessorios scale-bounce"><a onclick="mostrar_itens(3)" style="cursor:pointer;"></a></div>
                                    <div id="corpo" class="scale-bounce"><a onclick="mostrar_itens(4)" style="cursor:pointer;"></a></div>
                                </div>
                        </div>

                        <div class="loja-itens">
                            <div class="offset-md-1">
                                <div id="item-comprado-cores" class="item-comprado-cores">
                                    <div id="left_button_cor" class="left_buttom loja-page" style="display:none">
                                        <a onclick="mostrar_elementos_esquerda('cor')" style="cursor:pointer;"></a>
                                    </div>
                                    %z=0
                                    % for i in range(0, (len(cores)//3)):
                                        % if i > 0:
                                            <div id="bloco-cor-{{i+1}}" style="display:none">
                                                %for a in range(z,z+3):
                                                    <div class="itens-loja-corpo" onclick="change_avatar_color('{{cores[a]['image_name']}}','{{cores[a]['id']}}'); salvar_avatar();" style="margin-left: 5px;">
                                                        <div style="padding-top: 35px; float: left; width: 100%; text-align: center;">
                                                            <img class="" src="/static/img/body/{{cores[a]['image_name']}}"  style="max-height: 140px;">
                                                        </div>
                                                    </div>
                                                %end
                                                % if z != (len(cores)-1):
                                                   % z +=3
                                                % end
                                            </div>
                                        % else:
                                            <div id="bloco-cor-{{i+1}}">
                                                %for a in range(z, len(cores)):
                                                    %if z < 3:
                                                        <div class="itens-loja-corpo" onclick="change_avatar_color('{{cores[a]['image_name']}}','{{cores[a]['id']}}'); salvar_avatar();" style="margin-left: 5px;">
                                                            <div style="padding-top: 35px; float: left; width: 100%; text-align: center;">
                                                                <img class="" src="/static/img/body/{{cores[a]['image_name']}}"  style="max-height: 140px;">
                                                            </div>
                                                        </div>
                                                    %else:
                                                        %break
                                                    %end
                                                    % z+=1
                                                %end
                                            </div>
                                        % end
                                    % end
                                    <div id="right_button_cor" class="right_button loja-page">
                                        <a onclick="mostrar_elementos_direita('{{ len(cores) }}', 'cor')" style="cursor:pointer;"></a>
                                    </div>
                                </div>
                                <div id="item-comprado-rosto" class="item-comprado-acessorios" style="display:none;">
                                    <div id="left_button_rosto" class="left_buttom loja-page" style="display:none">
                                        <a onclick="mostrar_elementos_esquerda('rosto')" style="cursor:pointer;"></a>
                                    </div>
                                    %z=0
                                    % for i in range(0, (len(rostos)//3)):
                                        % if i > 0:
                                            <div id="bloco-rosto-{{i+1}}" style="display:none">
                                                %for a in range(z,z+3):
                                                    <div class="itens-loja-corpo" onclick="change_avatar_face('{{rostos[a]['image_name']}}','{{rostos[a]['id']}}')" style="margin-left: 5px;">
                                                        <div style="padding-top: 60px; float: left; width: 100%; text-align: center;">
                                                            <img class="rosto" src="/static/img/rosto/{{rostos[a]['image_name']}}">
                                                        </div>
                                                    </div>
                                                %end
                                                % if z != (len(rostos)-1):
                                                   % z +=3
                                                % end
                                            </div>
                                        % else:
                                            <div id="bloco-rosto-{{i+1}}">
                                                %for a in range(z, len(rostos)):
                                                    %if z < 3:
                                                        <div class="itens-loja-corpo" onclick="change_avatar_face('{{rostos[a]['image_name']}}','{{rostos[a]['id']}}')" style="margin-left: 5px;">
                                                            <div style="padding-top: 60px; float: left; width: 100%; text-align: center;">
                                                                <img class="rosto" src="/static/img/rosto/{{rostos[a]['image_name']}}">
                                                            </div>
                                                        </div>
                                                    %else:
                                                        %break
                                                    %end
                                                    % z+=1
                                                %end
                                            </div>
                                        % end
                                    % end
                                    <div id="right_button_rosto" class="right_button loja-page">
                                        <a onclick="mostrar_elementos_direita('{{ len(rostos) }}', 'rosto')" style="cursor:pointer;"></a>
                                    </div>
                                </div>

                                <div id="item-comprado-acessorios" class="item-comprado-acessorios" style="display:none;">
                                    <div id="left_button_acessorio" class="left_buttom loja-page" style="display:none">
                                        <a onclick="mostrar_elementos_esquerda('acessorio')" style="cursor:pointer;"></a>
                                    </div>
                                    %z=0
                                    % for i in range(0, (len(acessorios)//3)):
                                        % if i > 0:
                                            <div id="bloco-acessorio-{{i+1}}" style="display:none">
                                                %for a in range(z,z+3):
                                                    <div class="itens-loja-corpo" style="margin-left: 5px;">
                                                        % if str(acessorios[a]['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                            <div style="float: left; width: 100%; text-align: center;" onclick="change_avatar_acessorios('{{acessorios[a]['image_name']}}','{{acessorios[a]['id']}}')">
                                                                <img class="acessorio" src="/static/img/acessorio/{{acessorios[a]['image_name']}}" style="max-height: 222px; margin-top:-36px;">
                                                            </div>
                                                        % else:
                                                            <div style="float: left; width: 100%; text-align: center;">
                                                                <img class="acessorio" src="/static/img/acessorio/{{acessorios[a]['image_name']}}" style="max-height: 222px; margin-top:-36px;">
                                                            </div>
                                                            <div style="position: relative; margin-left: 35px;">
                                                            <img src="/static/img/custo_cristais.png" style="margin-top: -25px;">
                                                            </div>
                                                            <div style="top: -50px; float: left; position: relative; padding-left: 110px;" class="custo-cristais-loja">
                                                                {{acessorios[a]['preco']}}
                                                            </div>
                                                            <a onclick="comprar_acessorio('{{acessorios[a]['id']}}')" style="position: relative; margin-left: 44px; float: left;top: -26px;">
                                                                <img src="/static/img/btn_comprar.png">
                                                            </a>
                                                        %end
                                                    </div>
                                                %end
                                                % if z != (len(rostos)-1):
                                                   % z +=3
                                                % end
                                            </div>
                                        % else:
                                            <div id="bloco-acessorio-{{i+1}}">
                                                %for a in range(z, len(acessorios)):
                                                    %if z < 3:
                                                        <div class="itens-loja-corpo" style="margin-left: 5px;">
                                                            % if str(acessorios[a]['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                                <div style="float: left; width: 100%; text-align: center;" onclick="change_avatar_acessorios('{{acessorios[a]['image_name']}}','{{acessorios[a]['id']}}')">
                                                                    <img class="acessorio" src="/static/img/acessorio/{{acessorios[a]['image_name']}}" style="max-height: 222px; margin-top:-36px;">
                                                                </div>
                                                            % else:

                                                                <div style="float: left; width: 100%; text-align: center;">
                                                                    <img class="acessorio" src="/static/img/acessorio/{{acessorios[a]['image_name']}}" style="max-height: 222px; margin-top:-36px;">
                                                                </div>
                                                                <div style="position: relative; margin-left: 35px;">
                                                                <img src="/static/img/custo_cristais.png" style="margin-top: -25px;">
                                                                </div>
                                                                <div style="top: -50px; float: left; position: relative; padding-left: 110px;" class="custo-cristais-loja">
                                                                    {{acessorios[a]['preco']}}
                                                                </div>
                                                                <a onclick="comprar_acessorio('{{acessorios[a]['id']}}')" style="position: relative; margin-left: 44px; float: left;top: -26px;">
                                                                    <img src="/static/img/btn_comprar.png">
                                                                </a>
                                                            %end
                                                        </div>
                                                    %else:
                                                        %break
                                                    %end
                                                    % z+=1
                                                %end
                                            </div>
                                        % end
                                    % end
                                    <div id="right_button_acessorio" class="right_button loja-page">
                                        <a onclick="mostrar_elementos_direita('{{ len(acessorios) }}', 'acessorio')" style="cursor:pointer;"></a>
                                    </div>
                                </div>

                                <div id="item-comprado-corpo" class="item-comprado-acessorios" style="display:none;">
                                    <div id="left_button_corpo" class="left_buttom loja-page" style="display:none">
                                        <a onclick="mostrar_elementos_esquerda('corpo')" style="cursor:pointer;"></a>
                                    </div>
                                    %z=0
                                    % for i in range(0, (len(corpos)//3)):
                                        % if i > 0:
                                            <div id="bloco-corpo-{{i+1}}" style="display:none">
                                                %for a in range(z,z+3):
                                                    <div class="itens-loja-corpo" style="margin-left: 5px;">
                                                        % if str(corpos[a]['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                            <div style="padding-top: 35px; float: left; width: 100%; text-align: center;" onclick="change_avatar_body('{{corpos[a]['image_name']}}','{{corpos[a]['id']}}')">
                                                                <img class="acessorio" src="/static/img/corpo/{{corpos[a]['image_name']}}" style="max-width: 127px;">
                                                            </div>
                                                        %else:
                                                            <div style="padding-top: 35px; float: left; width: 100%; text-align: center;">
                                                                <img class="acessorio" src="/static/img/corpo/{{corpos[a]['image_name']}}" style="max-width: 127px;">
                                                            </div>
                                                            <div style="position: relative; margin-left: 35px;">
                                                                <img src="/static/img/custo_cristais.png" style="margin-top: -25px;">
                                                            </div>
                                                            <div style="top: -50px; float: left; position: relative; padding-left: 110px;" class="custo-cristais-loja">
                                                                {{corpos[a]['preco']}}
                                                            </div>
                                                            <a onclick="comprar_acessorio('{{corpos[a]['id']}}')" style="    position: relative; margin-left: 44px; float: left;top: -26px;">
                                                                <img src="/static/img/btn_comprar.png">
                                                            </a>
                                                        %end
                                                    </div>
                                                %end
                                                % if z != (len(rostos)-1):
                                                   % z +=3
                                                % end
                                            </div>
                                        % else:
                                            <div id="bloco-corpo-{{i+1}}">
                                                %for a in range(z, len(corpos)):
                                                    %if z < 3:
                                                        <div class="itens-loja-corpo" style="margin-left: 5px;">
                                                             % if str(corpos[a]['id']) in itens_usuario or usuario_logado['tipo']<= '5':
                                                                <div style="padding-top: 35px; float: left; width: 100%; text-align: center;" onclick="change_avatar_body('{{corpos[a]['image_name']}}','{{corpos[a]['id']}}')">
                                                                    <img class="acessorio" src="/static/img/corpo/{{corpos[a]['image_name']}}" style="max-width: 127px;">
                                                                </div>
                                                            %else:
                                                                <div style="padding-top: 35px; float: left; width: 100%; text-align: center;">
                                                                    <img class="acessorio" src="/static/img/corpo/{{corpos[a]['image_name']}}" style="max-width: 127px;">
                                                                </div>
                                                                <div style="position: relative; margin-left: 35px;">
                                                                    <img src="/static/img/custo_cristais.png" style="margin-top: -25px;">
                                                                </div>
                                                                <div style="top: -50px; float: left; position: relative; padding-left: 110px;" class="custo-cristais-loja">
                                                                    {{corpos[a]['preco']}}
                                                                </div>
                                                                <a onclick="comprar_acessorio('{{corpos[a]['id']}}')" style="position: relative; margin-left: 44px; float: left;top: -26px;">
                                                                    <img src="/static/img/btn_comprar.png">
                                                                </a>
                                                            %end
                                                        </div>
                                                    %else:
                                                        %break
                                                    %end
                                                    % z+=1
                                                %end
                                            </div>
                                        % end
                                    % end
                                    <div id="right_button_corpo" class="right_button loja-page">
                                        <a onclick="mostrar_elementos_direita('{{ len(corpos) }}', 'corpo')" style="cursor:pointer;"></a>
                                    </div>
                                </div>
                            </div>
                            <div class="botoes">
                                <img onclick="salvar_avatar()" src="/static/img/btn-salvar.png" style="cursor:pointer;">
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

            var bloco_visivel = 1;
            var elemento_ant = '';
            function mostrar_elementos_direita(total_elementos, elemento){
                total_blocos = parseInt(total_elementos)/3;
                if (elemento_ant != elemento){
                    elemento_ant = elemento
                    bloco_visivel = 1
                }
                if(bloco_visivel != total_blocos){
                    document.getElementById('bloco-'+ elemento+'-'+bloco_visivel).style.display = 'none';
                    document.getElementById('bloco-'+ elemento+'-'+(bloco_visivel+1)).style.display = 'block';
                    bloco_visivel ++;
                    if(bloco_visivel == total_blocos){
                        document.getElementById('right_button_'+elemento).style.display = 'none';
                        document.getElementById('left_button_'+elemento).style.display = 'block';
                    }
                }
            }

            function mostrar_elementos_esquerda(elemento){
                if(bloco_visivel >= 1){
                    document.getElementById('bloco-'+elemento+'-'+bloco_visivel).style.display = 'none';
                    document.getElementById('bloco-'+elemento+'-'+(bloco_visivel-1)).style.display = 'block';
                    bloco_visivel --;
                    if(bloco_visivel == 1){
                        document.getElementById('right_button_'+elemento).style.display = 'block';
                        document.getElementById('left_button_'+elemento).style.display = 'none';
                    }
                }
            }

             function comprar_acessorio(item){
                $.post('/comprar_item', {item:item},function(data){
                 });
            }
            function salvar_avatar(){
                $.post('/equipar_item', {avatar_cor:document.getElementById("avatar-itens-cor-id").value,avatar_rosto:document.getElementById("avatar-itens-rosto-id").value
                ,avatar_acessorios:document.getElementById("avatar-itens-acessorios-id").value,avatar_body:document.getElementById("avatar-itens-body-id").value},function(data){
                    window.location.replace("/");
                 });
            }
            var flag_rosto = 0;
            function change_avatar_color(color, id){
                color=color.toLowerCase();
                $("#avatar-itens-cor").remove();
                $("#avatar-itens-cor-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-cor-id' type='hidden' value='"+id+"'><img id='avatar-itens-cor' src='/static/img/body/"+color+"' value='teste' class='avatar-itens-cor imagem-pocicao-"+color.slice(0,4)+"' style='z-index: 11;position: absolute;top: 12px;left: 5px;'>");
            }
            function change_avatar_face(face, id){
                face=face.toLowerCase();
                $("#avatar-itens-rosto").remove();
                $("#avatar-itens-rosto-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-rosto-id' type='hidden' value='"+id+"'><img id='avatar-itens-rosto' src='/static/img/rosto/"+face+"' class='avatar-itens-rosto imagem-pocicao-"+face.slice(0,8)+"' style='z-index: 12; position: absolute; top: 37px; left: 30px;'>");
            }
            function change_avatar_acessorios(acessorios, id){
                acessorios=acessorios.toLowerCase();
                $("#avatar-itens-acessorios").remove();
                $("#avatar-itens-acessorios-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-acessorios-id' type='hidden' value='"+id+"'><img id='avatar-itens-acessorios' src='/static/img/acessorio/"+acessorios+"' class='avatar-itens-acessorio imagem-pocicao-"+acessorios.slice(0,10)+"' style='z-index: 13;    position: absolute;top: -174px;left: -89px;'>");
            }
            function change_avatar_body(body, id){
                body=body.toLowerCase();
                $("#avatar-itens-body").remove();
                $("#avatar-itens-body-id").remove();
                $("#avatar_usuario").append("<input id='avatar-itens-body-id' type='hidden' value='"+id+"'><img id='avatar-itens-body' src='/static/img/corpo/2"+body+"' class='avatar-itens-corpo' style='z-index: 12;position: absolute;top: -165px;left: -84px;'>");
            }
        </script>
    </body>
</html>