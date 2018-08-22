%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="relatorio_aluno.css")
%include('gestao_aprendizagem/menu/menu.tpl')
<div class="col-md-9 order-md-2 texto-inicial" style="margin-top: 15px;">
    <section class="container">
        <div class="col-md text-rel" style="padding-left:0px;">
          <h2>Relatório de aluno </h2>
        </div>

        <div class="col-md nome_aluno" style="padding-left:0px;">
          <span> {{aluno['nome']}} </span> - Turma: <span id="turma-num">{{aluno['vinculo_turma']}}</span>
        </div>

        <div class="input-group checkbox-group">
            <input type="checkbox" onchange="filtro_relatorio_aluno_detalhe({{aluno['id']}})" id="portugues" value="portugues" checked> <label  class="portugues" for="portugues">Língua Portuguesa</label>
            <input type="checkbox" onchange="filtro_relatorio_aluno_detalhe({{aluno['id']}})" id="matematica" value="matematica" checked> <label class="matematica" for="matematica">Matemática</label>
        </div>

        <div class="container offset-md-8" style="position:relative; right:27px;">
            <a href="" class="offset-md-4" > <img src="img/print-icon.png" alt="" style="width:2%; height:auto;"> </a>
        </div>
        <div id="teste">
            % include('gestao_aprendizagem/relatorios/aluno/relatorio_table.tpl')
        </div>

    </section>
</div>
%include('gestao_aprendizagem/footer/footer.tpl')