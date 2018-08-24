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
                        stepSize: 50
                    }
                }]
            },
        };
        lista = [];
        for(i = 0; i<pontos.length; i++){
            lista.push(pontos[i]);
        }
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [1,2,3,4,5,6,7,8,9,10],
            datasets: [{
                label: "Pontuaçao",
                // backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: lista,
            }]
        },

        // Configuration options go here
        options: options
    });
}