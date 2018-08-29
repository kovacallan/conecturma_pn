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
                                    <img id="avatar" src="/static/img/body/avatar-naked.png">
                                    <div id="avatar_usuario">
                                        
                                    </div>
                                    <div class="space_ship">
                                        <img id="nave" src="/static/img/space_avatar.png">
                                        <input id="apelido" type="text" name="apelido" value="teste">
                                        <div class="botoes">
                                            <img src="/static/img/btn-salvar.png" style="cursor:pointer;">
                                            <img src="/static/img/botao_limpar.png" style="cursor:pointer;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="itens">
                                <img id="setaUp" src="/static/img/avatar-top-button.png">
                                <div id="item-comprado-cores" class="item-comprado-cores">
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('amarelo')" style="margin-top:-65px;margin-left: -10px;">
                                        <img class="componente-loja-comprado" src="/static/img/body/amarelo.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('azul')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/body/azul.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('laranja')" style="margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/body/laranja.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('rosa')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/body/rosa.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('verde')" style="margin-top:-60px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/body/verde.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_color('vermelho')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/body/vermelho.png"></div>
                                </div>
                                <div id="item-comprado-rosto" class="item-comprado-rosto" style="display:none;">
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('rosto-01')" style="margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/rosto/rosto-01.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('rosto-02')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/rosto/rosto-02.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('rosto-03')" style="margin-top:-65px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/rosto/rosto-03.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('rosto-04')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/rosto/rosto-04.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('rosto-05')" style="margin-top:-60px;margin-left: -10px;"><img class="componente-loja-comprado" src="/static/img/rosto/rosto-05.png"></div>
                                    <div class="item-comprado-avatar scale-bounce" onclick="change_avatar_face('rosto-06')" style="margin-top:-30px;margin-left: 100px;"><img class="componente-loja-comprado" src="/static/img/rosto/rosto-06.png"></div>
                                </div>
                                <div id="item-comprado-acessorios" class="item-comprado-acessorios" style="display:none;"></div>
                                <div id="item-comprado-corpo" class="item-comprado-corpo" style="display:none;"></div>
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

            var flag_rosto = 0;
            function change_avatar_color(color){
                $("#avatar-itens-cor").remove();
                $("#avatar_usuario").append("<img id='avatar-itens-cor' src='/static/img/body/"+color+".png' class='avatar-itens-cor' style='z-index: 11;'>");
            }
            function change_avatar_face(face){
                $("#avatar-itens-rosto").remove();
                $("#avatar_usuario").append("<img id='avatar-itens-rosto' src='/static/img/rosto/"+face+".png' class='avatar-itens-rosto' style='z-index: 12;'>");
            }
        </script>
    </body>
</html>