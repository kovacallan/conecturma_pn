%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-listagem-escolas.css") 
%include('gestao_aprendizagem/menu/menu.tpl')

<div class="col-md-9 order-md-3 botao-tabela" style="margin-top: 6px;">
  <div class="container">
    <div class="row">
      <div class=" col-md-3">
        <p class="top-escolas-tabela">Escolas</p>
        <button type="button" class="botao-nova-escola" onclick="document.getElementById('new_school').style.display = 'inline'">
          <i class="fas fa-plus"></i>
          &nbsp;nova escola
        </button>
      </div>
      <div class="col-md-4 offset-md-5">
        <form class="form">
          <div class="input-group pesquisa">
            <!--pesquisa-->
            <input class="form-control pesquisa-input" type="text" placeholder="Pesquisar" aria-label="Search" style="padding-left: 20px; border-radius: 40px;background-color: #dedede;height: 30px;z-index: -1"
              id="mysearch">
            <div class="input-group-addon" style="margin-left: -26px;border-radius: 40px; background-color: #f3f3f3; border:none;">
              <button type="submit" style="border-radius: 20px;border:1px transparent;height: 30px;" id="search-btn">
                <i class="fa fa-search"></i>
              </button>
              <!--pesquisa-->
            </div>
          </div>
        </form>
      </div>
      <!--fim da div de pesquisa-->
    </div>
    <!--fim da row do conteudo acima da tabela -->
    <br/>
    <br/>
    <div id="new_school" style="display:none;">
      %include('gestao_aprendizagem/escola/formulario_cadastro_nova_escola.tpl')
    </div>
    <div id="accordion">
      <!-- inicio da tabela -->

      <div class="row">
        <div class="col-md-5 item-tabela topo-tab">
          Nome da escola
        </div>

        <div class="col-md-2 item-tabela topo-tab">
          Rede
        </div>

        <div class="col-md-2 item-tabela topo-tab">
          Diretor
        </div>

        <div class="col-md-2 item-tabela topo-tab">
          Telefone
        </div>

        <div class="col-md-1 item-tabela topo-tab">
        </div>
      </div>
      <!-- bloco de cabeçalho da lista -->
      <%
        for index,i in enumerate(escola):
      %>
        % if index % 2 ==0:
          <div class="row row-par">
            %include('gestao_aprendizagem/escola/escola_edicao_par.tpl')
          </div>
        % else:
          <div class="row row-impar">
            %include('gestao_aprendizagem/escola/escola_edicao_impar.tpl')
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