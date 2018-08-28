


<!DOCTYPE html>
<html>
<head>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
    <link rel="stylesheet" href="../static/bootstrap.min.css">
    <link rel="stylesheet" href="../static/style.css">
    <link rel="icon" type="image/png" href="img/icon_conecturma.png" >
    <script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
    <script type="text/javascript" src="../static/js/bootstrap.min.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="medalhas.css">
</head>

<body>
<header>
<div style="zindex"class="container cabecalho">
    <div class="row">
        <div class="menu col-md-9 offset-md-2">
            <ul>
                <li class="c"></li>
                <li class="ambiente"><a href="/gestao_aprendizagem"></a></li>
                <li class="facebook offset-md-1"><a href="https://www.facebook.com/conecturmaoficial/" target="_blank"></a></li>
                <li class="youtube offset-md-1"><a href="https://www.youtube.com/conecturma" target="_blank"></a></li>'
                <li class="sair offset-md-1"><a href="/sair"></a></li>
            </ul>
        </div>
    </div>
</div>
    </header>
<main>

<div class="container">
<div style="margin-left: 90px;">
    <div class="titulo  recentes" style="margin-top: 30px;"> </div>
            <br>
        <div style=""> <img src="img/recentes.png"> </div>
    </div>

    <div class="col-md offset-md-1">
       <br>
        <br>

        % if medalha_aluno!=[]:


        <div class="row recentes">
           <div class="bounce" style="background-image: url('img//fundo-medalha-recente.png');width: 220px;height:220px;text-align: center;display: block;opacity: 1;">
               <figure  >
                   <img class="medalha-lista-ultimas" src="/static/medalha/download-{{i['id']}}.gif">
               </figure>
            </div>

            <!--<div class="bounce" style="background-image: url('img//fundo-medalha-recente.png');width: 220px;height:220px;text-align: center; display: block;opacity: 1 ;margin-left: 20px;">-->
                <!--<figure >-->
                    <!--<img  class="medalha-lista-ultimas" src="img/download-2.gif">-->
                <!--</figure>-->
            <!--</div>-->
            <!--<div class="bounce" style="background-image: url('img//fundo-medalha-recente.png');width: 220px;height:220px;text-align: center; display: block;opacity: 1; margin-left: 20px;">-->
                <!--<figure >-->
                    <!--<img  class="medalha-lista-ultimas" src="img/download-3.gif">-->
                <!--</figure>-->
            <!--</div>-->

            <!--<div class="bounce" style="background-image: url('img//fundo-medalha-recente.png');width:220px;height:220px; text-align:center; display: block; opacity: 1; margin-left: 20px;">-->
                 <!--<figure>-->
                    <!--<img  class="medalha-lista-ultimas" src="img/download-4.gif">-->
                <!--</figure>-->
            <!--</div>-->

        </div>
    </div>
    %end
    <img src="img/separador.png" align="center" style="top: 20px;position: relative; margin-left: 100px;">

    <br>
    <br>
    <br>
    <div>
        <img src="img/medalhas.png" style="margin-left: 90px;">
        <a href="/AcademicoConecturma/Medalha/SalaMedalhas?filtro=socioemocional" style=" text-decoration: none;left:350px;position: absolute; text-decoration: none; font-size: small;text-decoration-color: white;">
            <img src="img/botao_inativo.png" style="">
            <div style="position: absolute; font-family:arial;color: white;top: 10px; left: 14px; ">DESEMPENHO</div>
        </a>
        <a href="/AcademicoConecturma/Medalha/SalaMedalhas?filtro=socioemocional" style="float: right;left: 535px;position: absolute; text-decoration: none; font-size: small;text-decoration-color: white;">
                        <img src="img/botao_ativo.png" style="margin-left: 5px;">
                        <div style="position: absolute;left: 24px;top: 10px;font-family:arial;color: white;">SÓCIOEMOCIONAL</div>
        </a>

        %for x in medalhas:

    </div>
    <br>
    <div class="todas-medalhas" >
        <div class="row" style="margin-left: auto; margin-right: auto;">
            <div class="todasmedalhas bounce" style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">
                        <div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador " src="/static/medalha/download-{{x['id']}}.gif" style="">
                        </div>
            </div>

            <!--<div class="todasmedalhas bounce"-->
                 <!--style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">-->
                <!--<div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador "-->
                          <!--src="img/download-5.gif" style="">-->
                <!--</div>-->
            <!--</div>-->

            <!--<div class="todasmedalhas bounce"-->
                 <!--style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">-->
                <!--<div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador "-->
                          <!--src="img/download-6.gif" style="">-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="todasmedalhas bounce"-->
                 <!--style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">-->
                <!--<div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador "-->
                          <!--src="img/download-2.gif"-->
                          <!--style="opacity: 0.5;grayscale(100%);-webkit-filter: grayscale(100%);">-->
                <!--</div>-->
            <!--</div>-->

            <!--<div class="todasmedalhas bounce"-->
                 <!--style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">-->
                <!--<div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador "-->
                          <!--src="img/download-3.gif" style="">-->
                <!--</div>-->
            <!--</div>-->




        </div> <!-- ROW -->

    <div class="row" style="margin-left: auto; margin-right: auto;">



             <div class="todasmedalhas bounce" style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">
                        <div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador " src="/static/download-{{x['id]}}.gif" style="">
                        </div>
            </div>

             <div class="todasmedalhas bounce" style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">
                        <div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador " src="img/download-7.gif" style="">
                        </div>
            </div>


             <div class="todasmedalhas bounce" style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">
                        <div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador " src="img/download-8.gif" style="">
                        </div>
            </div>


             <div class="todasmedalhas bounce" style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">
                        <div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador " src="img/download-9.gif" style="">
                        </div>
            </div>


             <div class="todasmedalhas bounce" style="background-image: url('img/fundo-medalha-todas.png');width: 150px;height: 150px;text-align: center;margin: 10px -8px 10px 30px;display: block;opacity: 1;">
                        <div><img alt="Jogador " class="medalha-lista-todas" data-id="" data-imagem="" id="img_Jogador " src="img/download-10.gif" style="">
                        </div>
            </div>

    </div> <!-- ROW -->


    %end

    </div>

    </div>











</main>
<script>
    function recebe_medalha (medalha){
    if (medalha == [])
    {
        getElementByClass('recentes').style.display=none;
    }
    else
    {
        getElementByClass('recentes').style.display=true;
    }

    }
</script>
</body>
</html>


% include('footer.tpl')

    i in medalhas:
Nome:{{i['nome']}}<br>
Tipo:{{i['tipo_medalha']}}<br>
Descrição: {{i['descricao']}}<br>
        Descrição Completa: {{i['descricao_completa']}}

