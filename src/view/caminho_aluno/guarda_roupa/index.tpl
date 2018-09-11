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
                        </div>
                        <div class="loja_avatar">
                            <img src="/static/img/body/avatar-naked.png">
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
                                    <div id="cor" class="scale-bounce"><a href="#"></a></div>
                                    <div id="rosto" class="scale-bounce"><a href="#"></a></div>
                                    <div id="acessorios" class="scale-bounce"><a href="#"></a></div>
                                    <div id="corpo" class="scale-bounce"><a href="#"></a></div>
                                </div>
                        </div>
                        <div class="left_buttom loja-page">
                                <a href="#"></a>
                            </div>
                        <div class="loja-itens">
                            <div class="offset-md-1">
                                <div class="itens-loja-corpo scale-bounce">
                                    <div style="padding-top: 35px; float: left; width: 100%; text-align: center;">
                                        <img class="corpo" src="/static/img/corpo/corpo-01.png">
                                    </div>   
                                    <div style="position: relative; margin-left: 35px;">
                                        <img src="/static/img/custo_cristais.png" style="margin-top: 10px;">
                                    </div> 
                                    <div style="top: -50px; float: left; position: relative; padding-left: 110px;" class="custo-cristais-loja">
                                        5
                                    </div>
                                    <a href="#" style="    position: relative; margin-left: 44px; float: left;top: -10px;">
                                        <img src="/static/img/btn_comprar.png">
                                    </a>
                                </div>
                                <div class="itens-loja-corpo scale-bounce" style="margin-left: 5px;">
                                    <div style="padding-top: 35px; float: left; width: 100%; text-align: center;">
                                        <img class="corpo" src="/static/img/corpo/corpo-02.png">
                                    </div>   
                                    <div style="position: relative; margin-left: 35px;">
                                        <img src="/static/img/custo_cristais.png" style="margin-top: 10px;">
                                    </div> 
                                    <div style="top: -50px; float: left; position: relative; padding-left: 110px;" class="custo-cristais-loja">
                                        50
                                    </div>
                                    <a href="#" style="    position: relative; margin-left: 44px; float: left;top: -10px;">
                                        <img src="/static/img/btn_comprar.png">
                                    </a>
                                </div>
                                <div class="itens-loja-corpo scale-bounce" style="margin-left: 5px;">
                                    <div style="padding-top: 35px; float: left; width: 100%; text-align: center;">
                                        <img class="corpo" src="/static/img/corpo/corpo-03.png">
                                    </div>   
                                    <div style="position: relative; margin-left: 35px;">
                                        <img src="/static/img/custo_cristais.png" style="margin-top: 10px;">
                                    </div> 
                                    <div style="top: -50px; float: left; position: relative; padding-left: 110px;" class="custo-cristais-loja">
                                        70
                                    </div>
                                    <a href="#" style="    position: relative; margin-left: 44px; float: left;top: -10px;">
                                        <img src="/static/img/btn_comprar.png">
                                    </a>
                                </div>
                            </div>
                            <div class="right_button loja-page">
                                <a href="#"></a>
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

            var flag_rosto = 0;
            function change_avatar_color(color){
                $("#avatar-itens-cor").remove();
                $("#avatar_usuario").append("<img id='avatar-itens-cor' src='img/body/"+color+".png' class='avatar-itens-cor' style='z-index: 11;'>");
            }
            function change_avatar_face(face){
                $("#avatar-itens-rosto").remove();
                $("#avatar_usuario").append("<img id='avatar-itens-rosto' src='img/rosto/"+face+".png' class='avatar-itens-rosto' style='z-index: 12;'>");
            }
        </script>
    </body>
</html>