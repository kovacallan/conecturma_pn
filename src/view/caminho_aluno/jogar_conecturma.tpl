<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ambiente Aprendizagem</title>
    <link rel="stylesheet" href="../static/bootstrap.min.css">
    <link rel="stylesheet" href="../static/style_aprendizagem_v2.css">

</head>
<body>
<div class="container-fluid fundo">
    <div class="offset-md-1 light-game">
        <div class="center">
            <div class="offset-md-8 col-md-2" align="right">
                <div class="game">
                    <a href="javascript:void(0)" onclick="atualizarHud()" class="close-game">
                            <img src="/static/img/botao_voltar.png" style="padding-left:52px">
                    </a>
                </div>
              </div>
            <iframe id="frame_jogo" src="" width="1014px" height="614px" align="middle"
                    style="border: 7px rgb(11, 104, 145) solid;"></iframe>
        </div>
    </div>
</div>
<div class="container cabecalho">
    <div class="row icones header-menu">
        <div align="center" class="col-md-2 offset-md-2">
            <figure class="figure">
                <img src="/static/img/C.png" class="img-fluid C-icon">
            </figure>
        </div>

        <div align="center" class="col-md-1">
            <a href="/gestao_aprendizagem">
                <figure class="figure">
                    <img src="/static/img/ambiente.png" class="img-fluid icon-edit">
                </figure>
            </a>
        </div>

        <div align="center" class="col-md-1 offset-md-1">
            <a href="https://www.facebook.com/conecturmaoficial/" target="_blank">
                <figure class="figure">
                    <img src="/static/img/facebook.png" class="img-fluid icon-edit">
                </figure>
            </a>
        </div>

        <div align="center" class="col-md-1 offset-md-1">
            <a href="https://www.youtube.com/conecturma" target="_blank">
                <figure class="figure">
                    <img src="/static/img/youtube.png" class="img-fluid icon-edit">
                </figure>
            </a>
        </div>

        <div align="center" class="col-md-1">
            <a href="/sair">
                <figure class="figure">

                    <img src="/static/img/sair.png" class="img-fluid exit-icon">

                </figure>
            </a>
        </div>
    </div>
</div>


<div class="container corpo-pag">
    <div class="row">
        <div class="col-md-3 avatar-std">
            <img src="/static/img/boneco_base2.png" class="boneco_base img-fluid">
            <img src="/static/img/AVATAR.png" class="avatar-ship img-fluid">
            <!--<div class="offset-md-4 col-md-1">-->
            <span id="CRYSTAL">{{moedas}}</span>
            <span id="HP">{{vida}}</span>
            <!--</div>-->
        </div>

        <div class="col-md-6 portal">
            <div id="sol">

                <img src="/static/img/sol-e-sombra.png" class="img-fluid sol">
                <a href="javascript:void(0)" class="btn-sun" style="cursor: pointer;">
                    <div class="sun" style="display: block;">
                        &nbsp;<img src="/static/img/sol-e-sombra.png" class="img-fluid sol">
                    </div>
                </a>

            </div>
            <div>
                <img src="/static/img/disco-voador2.png" class="img-fluid disco">
            </div>
            <div>
                <img src="/static/img/criancas.png" class="img-fluid criancas">
            </div>
        </div>

        <div class="col-md-3">
            <a href="#">
                <img src="/static/img/MEDALHAS.png" class="img-fluid">
            </a>
        </div>


    </div>

</div>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>

<script>





        $(document).ready(function () {

            $(".btn-sun").click(function () {

               hide_sun_elements();
               //Utilizado para mover o foco para o jogo, logo após clicar no sol.
               console.log('teste');
               $('iframe#frame_jogo').contents().find('body').trigger('pageshow');
            });

            $.reject({
                reject: {
                    safari: true, // Apple Safari
                    chrome: false, // Google Chrome
                    firefox: true, // Mozilla Firefox
                    msie: true, // Microsoft Internet Explorer
                    opera: true, // Opera
                    konqueror: true, // Konqueror (Linux)
                    unknown: true // Demais
                },
                display: ['chrome'],

                header: 'Seu navegador não é suportado!', // Header Text
                paragraph1: 'Os jogos da Conecturma necessitam do Google Chrome para funcionar.', // Paragraph 1
                paragraph2: 'Você pode efetuar a instalação através do link abaixo:',
                imagePath: '/Plugins/AcademicoConecturma/Eteg.Cronus.AcademicoConecturma.Web/assets/aluno/img/browser/',
                closeMessage: 'Ao fechar esta janela, você deve ter ciência de que alguns elementos da plataforma podem não funcionar corretamente.', // Message below close window link
                closeLink: "FECHAR"
            });
        });

        function hide_sun_elements(){
        console.log('hide');
            $(".portal").fadeOut(function(){
            console.log('os');
                $(".light-game").fadeIn(function() {
                console.log('elementos');
                    var src = "/jogo";
                    if ($('#frame_jogo').attr("src") === "") {
                    console.log('aqui');
                        $('#frame_jogo').attr("src", src);
                    }
                });
            });
            $(".cabecalho").fadeOut();
            $(".corpo-pag").fadeOut();
        }

        // Avoid 'console' errors in browsers that lack a console.
        // From: http://alvarotrigo.com/blog/disabling-javascript-console-in-production-enviroments-and-internet-explorer/
        (function () {
            var method;
            var noop = function () { };
            var methods = [
              'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
              'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
              'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
              'timeStamp', 'trace', 'warn'
            ];
            var length = methods.length;
            var console = (window.console = window.console || {});

            while (length--) {
                method = methods[length];

                // Only stub undefined methods.
                if (!console[method]) {
                    console[method] = noop;
                }
            }
        }());

        window.addEventListener("message", function (event) {
            console.log("PostMessage recebido.");
            var origemEvento = event.origin;
            console.log("message origin: " + event.origin);
            console.log("message source: " + event.source);
            console.log("message data: " + event.data);
            var parametros = JSON.parse(event.data);
            enviarRequisicaoAjax(
                parametros,
                function (data, textStatus, jqXhr) {
                    console.log("callback de sucesso ajax: " + textStatus);
                    var resposta = {};
                    try {
                        resposta = data;
                    } catch (ex) {
                        resposta = {
                            mensagensErro: ["Ocoreu um erro inesperado."],
                            tipoErro: "inesperado"
                        };
                    }
                    resposta.uuid = parametros.uuid;
                    event.source.postMessage(resposta, event.origin);
                },
                function (jqXhr, textStatus, errorThrown) {
                    console.log("callback de erro ajax: " + textStatus + ", " + errorThrown);
                    var respostaErro;
                    if (errorThrown === "Internal Server Error") {
                        respostaErro = {
                            mensagensErro: ["Ocoreu um erro inesperado."],
                            tipoErro: "inesperado"
                        };
                    } else {
                        respostaErro = {
                            mensagensErro: ["Não foi possível comunicar com o servidor."],
                            tipoErro: "conexaoServidor"
                        };
                    }
                    respostaErro.uuid = parametros.uuid;
                    event.source.postMessage(respostaErro, event.origin);
                }
            );
        });
        function enviarRequisicaoAjax(parametros, callbackSucesso, callbackErro) {
            console.log("enviarRequisicaoAjax parametros", parametros);
            console.log(parametros.operacao);
            var jqXhr = jQuery.ajax({
                type: "POST",
                url: "http://127.0.0.1:8080/" + "api/plataforma/" + parametros.operacao,
                traditional: true,
                data: JSON.stringify(parametros),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
            .done(callbackSucesso)
            .fail(callbackErro);
        }
        function atualizarHud() {
            $(".light-game").hide();
             $(".cabecalho").show();
            $(".corpo-pag").show();
            $(".portal").show();

            $.ajax({
                type: "POST",
               // url: '/AcademicoConecturma/AmbienteAprendizagem/ObterValoresHud',
                dataType: "json",
                success: function (hud) {
                    $('div.coins').text(hud.moedas);
                    $('div.star').text(hud.pontos);
                }
            });

        }



</script>
</div>
%include('gestao_aprendizagem/footer/footer.tpl')