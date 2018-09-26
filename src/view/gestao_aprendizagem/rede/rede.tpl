%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-listagem-escolas.css")
%include('gestao_aprendizagem/menu/menu.tpl')
<div class="col-md-9 order-md-3 botao-tabela" style="margin-top: 6px;">
    <div style="left: -14px;position: relative;">
      <p class="top-escolas-tabela" style="font-family: 'Arial';font-size: 25.08pt;color: #0391E6;margin-bottom: 0px;">Redes</p>
      <button type="button" class="botao-nova-escola" onclick="document.getElementById('new_school').style.display = 'inline'">
          <i class="fas fa-plus">
              &nbsp;Nova Rede
          </i>
      </button>
    </div>
    <div id="new_school" style="display:none;">
      %include('gestao_aprendizagem/rede/formulario_cadastro_nova_rede.tpl')
    </div>
    <div id="accordion">
      <!-- inicio da tabela -->

      <div class="row">
        <div class="col-md-5 item-tabela topo-tab">
          Nome da Rede
        </div>

        <div class="col-md-2 item-tabela topo-tab">
          Gestor
        </div>

        <div class="col-md-2 item-tabela topo-tab">
          Telefone
        </div>
        <div class="col-md-2 item-tabela topo-tab">
          Numero escolas
        </div>
        <div class="col-md-1 item-tabela topo-tab">
        </div>
      </div>
      <!-- bloco de cabeçalho da lista -->
       <%
        for index,i in enumerate(rede):
      %>
        % if index % 2 ==0:
          <div class="row row-par">
            %include('gestao_aprendizagem/rede/rede_edicao_par.tpl')
          </div>
        % else:
          <div class="row row-impar">
            <input type="hidden" id ="id_escola" value="{{i['id']}}">
            %include('gestao_aprendizagem/rede/rede_edicao_impar.tpl')
          </div>
        % end
      <%
        end
      %>
    </div>
  </div>
</div>

<script type="text/javascript">

  function test(ide) {
    console.log(ide);
    y = document.getElementById(ide).innerHTML;
    x = document.getElementById("nova-escola").style.display;
    console.log(x, y)
    if (x == "none") {
      document.getElementById("nova-escola").style.display = 'block';
      document.getElementById(ide).innerHTML = '<i class="fas fa-angle-up"></i>';
    }
    else {
      document.getElementById("nova-escola").style.display = 'none';
      document.getElementById(ide).innerHTML = '<i class="fas fa-angle-down"></i>';
      // document.getElementById(drop).style.display='block':
    }
  }

  function seta(ide) {
    setinha = document.getElementById(ide).querySelectorAll("#setinha");
    if (setinha[0].className == 'fas fa-angle-down') {
      document.getElementById(ide).innerHTML = '<i id="setinha" class="fas fa-angle-up"></i>';
    } else {
      document.getElementById(ide).innerHTML = '<i id="setinha" class="fas fa-angle-down"></i>';
    }
  };
</script>
%include('gestao_aprendizagem/footer/footer.tpl')