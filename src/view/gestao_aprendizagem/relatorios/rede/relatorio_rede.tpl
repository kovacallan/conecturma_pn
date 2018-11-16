%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="relatorio_aluno.css")
%include('gestao_aprendizagem/menu/menu.tpl')

<style>
    footer{

        position:absolute;

    }
</style>

<div class="col-md-9 order-md-2" style="margin-top: 6px;">
    <div class="col-md text-rel" style="padding-left:0px;">
        <h2>Selecione a Rede</h2>
    </div>

    <table class="table table-bordered" style="margin-top:0;">
    <thead style="background-color:#9ed0f6;">
      <tr style="color:#fff;">
        <th scope="col" colspan="2">Nome</th>
      </tr>
    </thead>

    <tbody style="background-color:#f3f3f3;">
        % if isinstance(rede, list):
            % for i in rede:
              <tr class="hoover" style="cursor: pointer;" onclick="redirect_vizualizar_relatorio({{i['id']}})">
                <td colspan="2">{{i['nome']}}</td>
              </tr>
            % end
        % else:
            <tr  class="hoover" style="cursor: pointer;" onclick="redirect_vizualizar_relatorio({{escola['id']}})">
                <td colspan="2">{{rede['nome']}}</td>
            </tr>
        %end
    </tbody>
  </table>

</div>
<script>
    function redirect_vizualizar_relatorio(id){
        window.location.replace("/relatorios/selecao_serie_rede?id="+id);
    }

</script>
    </div>
</div>

<!--<footer class="text-muted footer1">
    <div class="footer-font">Política de Privacidade | Copyright &copy; Aondê Educacional</div>
</footer>-->
<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
<script type="text/javascript" src="../static/js/Chart.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="../static/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../static/js/graficoRelatorio.js"></script>

%include('gestao_aprendizagem/footer/footer.tpl')
