<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogar Conecturma</title>
    <link rel="icon" type="image/png" href="../static/img/icon_conecturma.png">
    <link rel="stylesheet" href="../static/reset.css">
    <link rel="stylesheet" href="../static/bootstrap.min.css">
    <link rel="stylesheet" href="../static/style.css">
    <link rel="stylesheet" href="../static/error.css">
</head>

<body>
   <div class="light-box" id="divRecuperarSenha" style="display:none">

    <div align="center">
          <div class="bg-error">
                <span class="title-erro">Estamos confusos</span>
                <span style="padding-left:40px; padding-right: 40px;">
                    Ops! Você não escolheu as figurinhas corretas! Tente mais uma vez!
                </span>

               <a href="#" onclick="document.getElementById('divRecuperarSenha').style.display='none'"><img src="/static/img/btn-voltar-ligh.png"></a>
            </div>

        </div>
</div>
    <div class="container-fluid bg">
          <div class="container">
            <div class="col-md-12" style="top: 29px;">
                <div class="bg_login">
                    <main class="row">

                        <div class="form-group">
                         <img src="/static/img/login-img-2.png" id="login-img"   alt="Responsive image">
                            <section class="content-login col-md">

                                <div class="student col-md">
                                    <div id="titulo-aluno">
                                        <img src="/static/img/aluno-seta.png" id="aluno-seta" class="img-fluid" alt="Responsive image">
                                        <span id="aluno" class="h3 mb-3 font-weight-normal">Aluno</span>


                                    </div>
                                        <br>
                                    <label>Nome do usuário</label>
                                    <br>
                                    <input data-val="true" data-val-required="O Login do usuário é obrigatório" id="Login" name="Login" type="text" value="" placeholder="Login Aluno" style="text-transform:uppercase;">

                                </div>

                                <div class="pass col-md container">
                                    <br>
                                    <span class="pass-title">Senha</span>
                                    <img src="/static/img/btn-interrogacao.png" id="btn-interrogacao" class="img-fluid" alt="Responsive image" data-toggle="tooltip" data-placement="right" title="Informar senha do aluno">

                                    <div class="cartoons-pass">

                                        <div class="row">
                                            <div id="a" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_01.png" data-imagem-selecionada="a" alt="Responsive image">
                                                </figure>
                                            </div>
                                            <div id="b" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_02.png" data-imagem-selecionada="b" alt="Responsive image">
                                                </figure>
                                            </div>
                                            <div id="c" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_03.png" data-imagem-selecionada="c" alt="Responsive image">
                                                </figure>
                                            </div>

                                            <div id="d" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_04.png" data-imagem-selecionada="d" alt="Responsive image">
                                                </figure>


                                            </div>
                                        </div>
                                        <div class="row">
                                            <div id="e" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_05.png" data-imagem-selecionada="e" alt="Responsive image">
                                                </figure>
                                            </div>
                                            <div id="f" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_06.png" data-imagem-selecionada="f" alt="Responsive image">
                                                </figure>
                                            </div>
                                            <div id="g" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_07.png" data-imagem-selecionada="g" alt="Responsive image" style="position:relative;top: 3px">
                                                </figure>
                                            </div>
                                            <div id="h" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_08.png" data-imagem-selecionada="h"  alt="Responsive image" style="position:relative;bottom:6px">
                                                </figure>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div id="i" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_09.png" data-imagem-selecionada="i" alt="Responsive image">
                                                </figure>
                                            </div>
                                            <div id="j" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_10.png" data-imagem-selecionada="j" alt="Responsive image">
                                                </figure>
                                            </div>
                                            <div id="k" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on" >
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_11.png" data-imagem-selecionada="k"  alt="Responsive image" style="position:  relative;bottom: 3px;">
                                                </figure>
                                            </div>
                                            <div id="l" onmouseout="mouse_out(this.id)" onmouseover="mouse_in(this.id)" onclick="mudaEstado(this.id)" class="box-cartoons on">
                                                <figure>
                                                    <img class="img_selecionada img-fluid" src="/static/img/avatar_12.png" data-imagem-selecionada="l" alt="Responsive image">
                                                </figure>
                                            </div>

                                        </div>
                                    </div>
                                    <div>
                                        <button id="botao_aluno" onclick="login_aluno()" style="cursor:pointer">

                                        </button>
                                    </div>

                                </div>
                                <input data-val="true" data-val-required="A senha do usuário é obrigatória" id="senhaAluno" name="Senha" type="hidden" value="">
                        </section>
                        </div>
                        <div id="Login-div">
                            <div class="form-group">
                                <div class="col-md">
                                   <section class="content-professor">
                                        <div class="professor">
                                            <div id="titulo-prof">
                                                <img src="/static/img/professor-seta.png" id="professor-seta" class="img-fluid" alt="Responsive image">
                                                <h2 class="h3 mb-3 font-weight-normal professor-text">Professor</h2>
                                            </div>
                                            <label for="inputEmail" class="label-prof-email">Email</label><br>
                                            <input type="text" id="inputEmail" class="email-prof" placeholder="Email" required="">
                                            <br>
                                            <br>
                                            <label for="inputPassword" class="label-prof-senha" style="margin-bottom: 0;">Senha</label><br>
                                            <input type="password" id="inputPassword" class="senha-prof" placeholder="Senha" required=""><br>
                                             <!--<a href="#" onclick="" class="lost-pass">Esqueci minha senha</a> -->
                                            <br>
                                            <br>
                                            <button onclick="login_professor()" id="btn-professor" style="cursor: pointer;"></button>
                                        </div>


          </section>
          </div>
          </div>
          </div>









    </main>
    </div>
    </div>
    </div>
    </div>

    <script type="text/javascript">
        (function($) {
                (function($) {
                        $('[data-imagem-selecionada]').on('click', function() {
                            var senhaAluno = $('#senhaAluno');
                            var senhaDigitada = senhaAluno.val();
                            var caractere = $(this).data('imagem-selecionada');
                            var div = $(this).parent();

                            div.toggleClass('box-selected');
                            if (senhaDigitada && senhaDigitada != '') {
                                senhaDigitada = senhaDigitada.toString();
                                if (senhaDigitada.indexOf(caractere.toString()) > -1) {
                                    senhaDigitada = senhaDigitada.replace(caractere.toString(), '');
                                } else {
                                    senhaDigitada += caractere;
                                }
                            } else {
                                senhaDigitada = caractere;
                            }
                            senhaAluno.val(senhaDigitada);
                        });
                    });
                });
    </script>
    <script type="text/javascript" src="/static/js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="/static/js/bootstrap.min.js"></script>
    <script  type="text/javascript" src="/static/js/bootstrap.bundle.min.js" ></script>
    <script type="text/javascript" src="/static/js/script.js"></script>



     <footer align="center">

        <img src="/static/img/edufuturo-1.png">

    </footer>
<script>
    console.log('Total width/height: ' + screen.width + 'x' + screen.height);
    width = screen.width;
    height = screen.height;
 if (width <= 800 || height <= 600)
    {
    alert("A resolução da tela do seu monitor é " + width + "x" + height + ". Para visualizar o site é recomendado uma resolução de no mínimo 1024x768.");
     $( "div" ).remove();
     $( "footer" ).remove();
     $("body").append("<header style='background-color: #0391E6;'><div align='center' style='padding-bottom: 14px;'><img  src='/static/img/conecturma-logo.png' id='conecturma-logo' class='img img-fluid'></div></header");
     $("body").append("<main align='center'>Mas se quiser ver como está ficando clique no link</main>");
     $("body").append("<footer style='position: absolute; bottom: 0px; background-color: #bed7ea;width: 100%; padding-bottom: 21px; padding-top:5px;margin-top: 10px;'><h4 id='footer-text' align='center' style='font-size:18.12px;  font-family:'Calibri';color:#9bacba; font-weight:lighter;'>Políticas de privacidade | copyright 2018</h4></footer>");
    }
</script>
</body>
</html>
