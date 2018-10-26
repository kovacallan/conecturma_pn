<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
<script type="text/javascript" src="../static/js/Chart.min.js"></script>
<script type="text/javascript" src="../static/js/vanilla-masker.js"></script>
<script src="../static/js/interact.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../static/js/graficoRelatorio.js"></script>
<script type="text/javascript" src="../static/js/jquery-paginate.js"></script>
<script type="text/javascript" src="../static/js/script.js"></script>
<script>
    $('#page-content').easyPaginate({
    paginateElement: 'div',
    elementsPerPage: 1,
    effect: 'default'
});

</script>
<script>
function Hover(){
    $(document).ready(function(){
    $(".change").hover(function(){
        $(this).css("background-color", "blue");
        }, function(){
        $(this).css("background-color", "#dee2e6");
    });
});
}
</script>

<!--<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>-->

</body>
</html>