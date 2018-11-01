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
            Média geral Língua Portuguesa:{{media_portugues}} ,
            Média geral Matemática:{{media_matematica}}
        </div>

        <div id="teste">
            % include('gestao_aprendizagem/relatorios/turma/relatorio_table.tpl')
        </div>

        <div class="container offset-md-8" style="position:relative; right:27px;">
            <a href="" class="offset-md-4" > <img src="img/print-icon.png" alt="" style="width:2%; height:auto;"> </a>
        </div>
        <div id="teste">

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


%include('gestao_aprendizagem/footer/footer.tpl')