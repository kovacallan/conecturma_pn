<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Impressão</title>
    <link rel="stylesheet" href="../static/bootstrap.min.css">
</head>
<body>

<div class="container">
    <div class="col-md-10">
        <div class="col-md nome_aluno" style="margin-top:15px; padding-left:0px; color:#299ae8;">
            <h2>Nome do Aluno: {{aluno['nome']}}</h2><br>
            <h3>Turma do Aluno: <span id="turma-num">{{aluno['vinculo_turma']}}</span></h3>
        </div>
    </div>
    <div class="col-md-10">
        <canvas id="myChart_mat"></canvas>

        <canvas id="myChart_port"></canvas>
    </div>
</div>


<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
<script type="text/javascript" src="../static/js/Chart.min.js"></script>
<script>
    lista = []
    bg_color =  []
    notas = {{pontos_mat}};
    for(i = 0; i<notas.length; i++){
        if (notas[i] != -1)
            lista.push(notas[i]);
        else
            lista.push(0);

        if (notas[i] >= 70){
            bg_color.push('rgb(0, 255, 0)');
        }
        else if(notas[i] < 70 && notas[i] >= 50){
            bg_color.push('rgb(255, 202, 0)');
        }
        else{
            bg_color.push('rgb(255, 0, 0)');
        }
    }

    lista.push(0);
    lista.push(100);

    var ctx = document.getElementById('myChart_mat').getContext('2d');
    var options = {
            title : {
                display : true,
                position : "top",
                text : "Pontuação média do aluno nas Oas de Matemática",
                fontSize : 18,
                fontColor : "#111"
            },
            legend : {
                display : false,
                position : "bottom"
            },
            scales: {
               xAxes: [{
                    ticks: {
                        min:0,
                        max:100,
                       callback: function(value){return value+ "%"}

                    }
                }]

            },
        };
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: {
            labels: {{oa_mat}},
            datasets: [{
                label: "pontuação",
                // backgroundColor: 'rgb(255, 99, 132)',
                backgroundColor: bg_color,
                borderColor: bg_color,
                data: lista,
            }]

        },

        // Configuration options go here
        options: options
    });
</script>
<script>
    lista = []
    bg_color =  []
    notas = {{pontos_port}}
    for(i = 0; i<notas.length; i++){
        if (notas[i] != -1)
            lista.push(notas[i]);
        else
            lista.push(0);

        if (notas[i] >= 70){
            bg_color.push('rgb(0, 255, 0)');
        }
        else if(notas[i] < 70 && notas[i] >= 50){
            bg_color.push('rgb(255, 202, 0)');
        }
        else{
            bg_color.push('rgb(255, 0, 0)');
        }
    }

    lista.push(0);
    lista.push(100);

    var ctx = document.getElementById('myChart_port').getContext('2d');
    var options = {
            title : {
                display : true,
                position : "top",
                text : "Pontuação média do aluno nas Oas de Português",
                fontSize : 18,
                fontColor : "#111"
            },
            legend : {
                display : false,
                position : "bottom"
            },
            scales: {
               xAxes: [{
                    ticks: {
                        min:0,
                        max:100,
                       callback: function(value){return value+ "%"}

                    }
                }]

            },
        };
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: {
            labels: {{oa_port}},
            datasets: [{
                label: "pontuação",
                // backgroundColor: 'rgb(255, 99, 132)',
                backgroundColor: bg_color,
                borderColor: bg_color,
                data: lista,
            }]

        },

        // Configuration options go here
        options: options
    });
</script>
</body>
</html>
