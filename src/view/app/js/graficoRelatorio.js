function funcoes(ide, pontos){
    seta(ide);
    grafico(ide,pontos);
 }
flag = 0;
function seta(ide){
    if(flag == 0){
        $('#setinha_'+ide+'_down').hide();
        $('#setinha_'+ide+'_up').show();
        flag = 1;
    }
    else{
        $('#setinha_'+ide+'_up').hide();
        $('#setinha_'+ide+'_down').show();
        flag = 0;
    }

}

function grafico(ide, pontos){
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }

    var ctx = document.getElementById('myChart_'+ide).getContext('2d');
    var options = {
            title : {
                display : true,
                position : "top",
                text : "Pontuação",
                fontSize : 18,
                fontColor : "#111"
            },
            legend : {
                display : true,
                position : "bottom"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0,
                        stepSize: 10
                    }
                }]
            },
        };
        lista = [];
        bg_color = []
        for(i = 0; i<pontos.length; i++){
            lista.push(pontos[i]);
            if (pontos[i] >= 70){
             bg_color.push('rgb(0, 255, 0)');
            }
            else if(pontos[i] < 70 && pontos[i] >= 50){
                bg_color.push('rgb(255, 202, 0)');
            }
            else{
                bg_color.push('rgb(255, 0, 0)');
            }
        }
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: [1,2,3,4,5,6,7,8,9,10],
            datasets: [{
                label: "Pontuaçao",
                // backgroundColor: 'rgb(255, 99, 132)',
                backgroundColor: bg_color,
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                data: lista,
            }]
        },

        // Configuration options go here
        options: options
    });
}

function grafico_turma(alunos, pontos){
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["0","1","2","3", "4","5","6","7","8","9","10"],
            datasets: [{
                label: 'Alunos',
                data: ['0','50%','75%','100%'],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

}