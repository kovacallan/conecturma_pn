%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-listagem-escolas.css")
%include('gestao_aprendizagem/menu/menu.tpl')
<div class="col-md-9 order-md-3 botao-tabela" style="margin-top: 6px;">
  <div class="container">
    <div class="row">
      <div class=" col-md-3">
        <p class="top-escolas-tabela" style="padding-top:5px;">Redes</p>
          % if tipo == '0':
            <button type="button" class="botao-nova-escola" onclick="document.getElementById('new_school').style.display = 'inline'">
              <i class="fas fa-plus"></i>
              &nbsp;Nova Rede
            </button>
          % end
      </div>
      <div class="col-md-4 offset-md-5">
        <form class="form">
          <div class="input-group pesquisa">
            <!--pesquisa-->
            <!--<input class="form-control pesquisa-input" type="text" placeholder="Pesquisar" aria-label="Search" style="padding-left: 20px; border-radius: 40px;background-color: #dedede;height: 30px;z-index: -1" id="mysearch">
            <div class="input-group-addon" style="margin-left: -26px;border-radius: 40px; background-color: #f3f3f3; border:none;">
              <button type="submit" style="border-radius: 20px;border:1px transparent;height: 30px;" id="search-btn">
                <i class="fa fa-search"></i>
              </button>
              <!--pesquisa-->
            </div>
        </form>
          </div>
      </div>
      <!--fim da div de pesquisa-->
    </div>
    <!--fim da row do conteudo acima da tabela -->
    <br/>
    <br/>
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