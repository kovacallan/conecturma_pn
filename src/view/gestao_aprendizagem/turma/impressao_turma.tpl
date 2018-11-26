<head>
    <!--<meta charset="UTF-8">-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Impressao</title>
    <link rel="icon" type="image/png" href="../static/img/icon_conecturma.png" >
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="../static/reset.css">


    <link rel="stylesheet" href="../static/bootstrap.min.css">
    <link rel="stylesheet" href="../static/css-gestao-aprendizagem.css" media="all">
    <link rel="stylesheet" href="../static/css-listagem-escolas.css" media="all">


</head>

% for z in range(len(aluno)):

 <div class="col-md-12" style="">
                            <div class="row" style="clear: both;">
                                <div class="col-md-8">
                                    % if z % 2 ==0:
                                    <div class="row row-impar nome-prof">
                                        <div class="col-md-4" style="margin-top: 4px;">
                                            Nome: {{aluno[z]['nome']}}
                                            <br>
                                            Login :{{aluno[z]['nome_login']}}
                                        </div>

                                        <div class="col-md-6 offset-md-2" style="padding:10px">
                                            <span style="margin-left: 17px;"> &nbsp;senha :</span>
                                            <img src="/static/img/{{aluno[z]['senha'][0]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                            <img src="/static/img/{{aluno[z]['senha'][1]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                            <img src="/static/img/{{aluno[z]['senha'][2]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                            <img src="/static/img/{{aluno[z]['senha'][3]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                        </div>
                                    </div>
                                         % else:

                                    <div class="row row-par nome-prof">
                                        <div class="col-md-4" style="margin-top: 4px;">
                                            Nome: {{aluno[z]['nome']}}
                                            <br>
                                            Login :{{aluno[z]['nome_login']}}
                                        </div>
                                        <div class="col-md-6 offset-md-2" style="padding:10px">
                                            <span style="margin-left: 17px;"> &nbsp;senha :</span>
                                            <img src="/static/img/{{aluno[z]['senha'][0]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                            <img src="/static/img/{{aluno[z]['senha'][1]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                            <img src="/static/img/{{aluno[z]['senha'][2]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                            <img src="/static/img/{{aluno[z]['senha'][3]}}.png"
                                                 style="padding-left:11px;width: 15%;margin-right:5px;">
                                        </div>
                                    </div>
                                    %end

                                </div>
                            </div>
                        </div>
 %end
<script>
    window.onload = window.print();
</script>