%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="relatorio_aluno.css")
%include('gestao_aprendizagem/menu/menu.tpl')
<div class="col-md-9 order-md-2 texto-inicial" style="margin-top: 15px;">
    <section class="container">
        <div class="col-md text-rel" style="padding-left:0px;">
          <h2>Relatório de Turma </h2>
        </div>

        <div class="col-md nome_aluno" style="padding-left:0px;">
            <span> {{turma['nome']}} </span> - <span id="turma-num">{{teste_serie[turma['serie']]}}</span>
        </div>
        <div>
            Média geral: {{media_geral}} ,
            Média Língua Portuguesa:{{media_portugues}} ,
            Média Matemática:{{media_matematica}}
        </div>

        <form id="impressao" action="relatorio_turma_impressao" method="post">
            <input type="hidden" name="turma" value="{{turma['id']}}">
        </form>

        <div class="container offset-md-11" style="color:#666666;">
            <i onclick="formSubmit()" class="fas fa-print" style="cursor:pointer;"></i>
        </div>

        <div id="teste">
            % include('gestao_aprendizagem/relatorios/turma/relatorio_table.tpl')
        </div>

    </section>
</div>
    </div>
</div>

<!--<footer class="text-muted footer1">
    <div class="footer-font">Política de Privacidade | Copyright &copy; Aondê Educacional</div>
</footer>-->
<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="../static/js/Chart.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="../static/js/graficoRelatorio.js"></script>
<script type="text/javascript" src="../static/js/script.js"></script>

<script>
    function formSubmit(){
        document.getElementById("impressao").submit();
    }
</script>


%include('gestao_aprendizagem/footer/footer.tpl')