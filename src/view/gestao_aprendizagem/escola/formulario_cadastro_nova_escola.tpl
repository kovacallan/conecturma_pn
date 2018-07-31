%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-listagem-escolas.css")
%include('gestao_aprendizagem/menu/menu.tpl')

<div class="col-md-9 order-md-3 botao-tabela">
    <div class="container">
        <div class="row">
            <div class=" col-md-3">
                <p class="top-escolas-tabela">Escolas</p>
                <button type="button" class="botao-nova-escola" onclick="document.getElementById('new_school').style.display = 'inline'">
                    <i class="fas fa-plus"></i>
                    &nbsp;nova escola
                </button>
            </div>
            <div class="col-md-4 offset-md-5" >
                <form class="form" >
                    <div class="input-group pesquisa">
                        <input class="form-control pesquisa-input" type="text" placeholder="Pesquisar" aria-label="Search" style="padding-left: 20px; border-radius: 40px;background-color: #dedede;height: 30px;z-index: -1" id="mysearch">
                        <div class="input-group-addon" style="margin-left: -26px;border-radius: 40px; background-color: #f3f3f3; border:none;">
                            <button type="submit" style="border-radius: 20px;border:1px transparent;height: 30px;" id="search-btn"><i class="fa fa-search"></i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <br/>
        <br/>
        <div id="new_school" style="display:none;">
            <div class="row row-impar">
                <div class="col-md-11 item-tabela-h" style="color:black">
                    nova escola
                </div>
                <div class="col-md-1 item-tabela" align="center">
                    <button id="dads" class="normalizar-botao" onclick="test(this.id);" >
                         <i class='fas fa-angle-up'></i>
                    </button>
                </div>
            </div>
            <div class="row row-impar" id="nova-escola" style="display: block">
                <div class="container">
                    <div id="teste" class="row new-scola">
                        <div class="col-md-12">
                            <ul class="nav nav-tabs abas" role="tablist">
                                <li class="nav-item ">
                                    <a class="nav-link active " data-toggle="tab" href="#dados-da-escola" role="tab" aria-controls="dados-da-escola" aria-selected="true">Dados da Gerais</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-content row-impar" id="nav-tabContent">
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">

  function test(ide){
  console.log(ide);
  y=document.getElementById(ide).innerHTML;
  x=document.getElementById("nova-escola").style.display;
  console.log(x,y)
  if(x=="none"){
  document.getElementById("nova-escola").style.display='block';
  document.getElementById(ide).innerHTML='<i class="fas fa-angle-up"></i>';
 }
 else{
  document.getElementById("nova-escola").style.display='none';
  document.getElementById(ide).innerHTML='<i class="fas fa-angle-down"></i>';
    // document.getElementById(drop).style.display='block':
 }
  }

 function seta(ide){
  setinha = document.getElementById(ide).querySelectorAll("#setinha");
  if (setinha[0].className == 'fas fa-angle-down'){
    document.getElementById(ide).innerHTML='<i id="setinha" class="fas fa-angle-up"></i>';
  }else{
    document.getElementById(ide).innerHTML='<i id="setinha" class="fas fa-angle-down"></i>';
  }
};
</script>
%include('gestao_aprendizagem/footer/footer.tpl')