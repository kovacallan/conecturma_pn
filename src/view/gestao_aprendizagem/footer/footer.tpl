<div id="footer"></div>
</div>

 <footer>
    <h4 id="footer-text" align="center" style   ="font-size: 18.12px;  font-family: 'Calibri';color: #fff; font-weight: lighter;">
        Políticas de privacidade | copyright 2018
    </h4>
 </footer>
<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
<script type="text/javascript" src="../static/js/Chart.min.js"></script>
<script type="text/javascript" src="../static/js/vanilla-masker.js"></script>
<script src="../static/js/interact.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../static/js/graficoRelatorio.js"></script>
<script type="text/javascript" src="../static/js/script.js" charset="UTF-8"></script>
<script type="text/javascript" src="../static/js/jquery-paginate.js" charset="UTF-8"></script>
<script type="text/javascript" src="../static/js/pagination.js" charset="UTF-8"></script>
    <script>
  $(document).ready(function () {
    $('.dropdown-toggle').mouseover(function() {
        $('.dropdown-menu').show();
    })

    $('.dropdown-toggle').mouseout(function() {
        t = setTimeout(function() {
            $('.dropdown-menu').hide();
        }, 100);

        $('.dropdown-menu').on('mouseenter', function() {
            $('.dropdown-menu').show();
            clearTimeout(t);
        }).on('mouseleave', function() {
            $('.dropdown-menu').hide();
        })
    })
})
</script>
<script>
     var table = '#mytable'
    $('#maxRows').on('change', function(){
        $('.pagination').html('')
        var trnum = 0
        var maxRows = parseInt($(this).val())
        var totalRows = $(table+' tbody tr').length
        $(table+' tr:gt(0)').each(function(){
            trnum++
            if(trnum > maxRows){
                $(this).hide()
            }
            if(trnum <= maxRows){
                $(this).show()
            }
        })
        if(totalRows > maxRows){
            var pagenum = Math.ceil(totalRows/maxRows)
            for(var i=1;i<=10;){
                $('.pagination').append('<li class="page-item" id="paginas" data-page="'+i+'">\<a>'+ i++ +'<span class="sr-only">(current)</span></a>\</li>').show()
            }
        }
        $('.pagination li:first-child').addClass('active')
        $('.pagination li').on('click',function(){
            var pageNum = $(this).attr('data-page')
            var trIndex = 0;
            $('.pagination li').removeClass('active')
            $(this).addClass('active')
            $(table+' tr:gt(0)').each(function(){
                trIndex++
                if(trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
                    $(this).hide()
                } else{
                    $(this).show()
                }
            })
        })
    })



</script>


    <script>
    function esconder(id){


        $("."+id).toggle();

        }
</script>

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
<script>
function printContent(name) {

var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");

    ctx.fillStyle="gold";
    ctx.strokeStyle="blue";
    ctx.lineWidth=5;
    ctx.rect(50,50,100,100);
    ctx.fill();
    ctx.stroke();

     var printContents = document.getElementById(name).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}
</script>
<!--<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>-->

</body>
</html>