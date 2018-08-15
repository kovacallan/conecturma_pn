
function seta(ide, grafico){
  setinha = document.getElementById(ide).querySelectorAll('#setinha');
  if (setinha[0].className == 'fas fa-angle-down '+ide) {
    document.getElementById(ide).innerHTML = '<i id="setinha" class="fas fa-angle-up"></i>';
  } else {
    document.getElementById(ide).innerHTML = '<i id="setinha" class="fas fa-angle-down"></i>';
  }
};

// Close the dropdown if the user clicks outside of it
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

var ctx = document.getElementById('myChart').getContext('2d');
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
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [0,1,2,3,4,5,6,7,8,9],
        datasets: [{
            label: "Pimpolhos",
            // backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: options
});
