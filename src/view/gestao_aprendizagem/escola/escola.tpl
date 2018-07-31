%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-listagem-escolas.css")
%include('gestao_aprendizagem/menu/menu.tpl')

 <div class="col-md-9 order-md-3 botao-tabela">
    <div class="row">
        <div class=" col-md-3">
            <p class="top-escolas-tabela">Escolas</p>
            <button type="button" class="botao-nova-escola" onclick="document.getElementById('new_school').style.display = 'inline'">
                <i class="fas fa-plus"></i>
                &nbsp;nova escola
            </button>
        </div>
        <div class="col-md-3 offset-md-6" >
            <form class="form">
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
                <div class="col-md-1 item-tabela">
                    <button id="dads" class="normalizar-botao" onclick="test(this.id);" >
                        <i class='fas fa-angle-up'></i>
                    </button>
                </div>
            </div>
            <div class="row row-impar" id="nova-escola" style="display: block">
                <div class="container">
                    <div id="teste" class="row new-scola"><!--conteudo interno do botao a partir daqui-->
                        <div class="col-md-12">
                            <ul class="nav nav-tabs abas" role="tablist">
                                <li class="nav-item ">
                                    <a class="nav-link active " data-toggle="tab" href="#dados-da-escola" role="tab" aria-controls="dados-da-escola" aria-selected="true">Dados da Gerais</a>
                                </li>
                            </ul>
                        </div>

                        <div class="tab-content row-impar" id="nav-tabContent">
                        <form>
                            %include('gestao_aprendizagem/escola/formulario_cadastro_nova_escola.tpl')
                        </form>
                    </div>
            </div>
                </div>
        </div>
        <div id="accordion">
            <div class="row">
                <div class="col-md-5 item-tabela topo-tab">
                    Nome da escola
                </div>
                <div class="col-md-2 item-tabela topo-tab">
                    Rede
                </div>
                <div class="col-md-2 item-tabela topo-tab">
                    Status
                </div>
                <div class="col-md-2 item-tabela topo-tab">
                    CNPJ
                </div>
                <div class="col-md-1 item-tabela topo-tab">
                </div>
            </div>
            <div class="row row-par">
                <div class="col-md-5 item-tabela ">
                    Escola do Rock
                </div>
                <div class="col-md-2 item-tabela ">
                    Solid , rock solid
                </div>
                <div class="col-md-2 item-tabela">
                    nunca soube
                </div>
                <div class="col-md-2 item-tabela" >
                    um numero ae
                </div>
                <div align="center" class="col-md-1 item-tabela card colocar-direita">
                    <a data-toggle="collapse" href="#collapseOne" aria-expanded="true" data-parent="#accordion"   aria-controls="collapseOne" class="" id="id-escola-d-rock" onclick="seta('id-escola-d-rock')">
                        <i id="setinha" class='fas fa-angle-down'></i>
                    </a>
                </div>
              </div>
              <div class="row row-par">
                  <div id="collapseOne" class="collapse col-md-12 item-tabela" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">
                      <div class="card-body">
                          <div class="row">
                              <div class="col-md-12">
                                  <ul class="nav nav-tabs abas" role="tablist">
                                      <li class="nav-item ">
                                          <a class="nav-link active " data-toggle="tab" href="#escola-do-rock" role="tab" aria-controls="escola-do-rock" aria-selected="true">Dados da Gerais</a>
                                      </li>
                                      <li class="nav-item">
                                          <button class="nav-link" data-toggle="tab" href="#escola-do-rock-prof" aria-controls="escola-do-rock-prof" aria-selected="false" >Professores</button>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                          <div class="tab-content row-par" >
                              <div class="tab-pane container active" id="escola-do-rock">
                                  <form>
                                      <div class="row distanciamento" style="margin-top: 30px">
                                          <div class="offset-md-1 col-md-">
                                              <img src="/static/img/editar-foto.png" style="border:2px black;z-index: 0;">
                                          </div>
                                          <div class="offset-md-1 col-md-7">
                                              <div class="row distanciamento">
                                                  <div class=" col-md-">
                                                      <label for="nome" style="background-color: inherit;">Nome:<span style="color:red">*<span></label>
                                                      <input type="text" placeholder="Escola do rock" class="form-control" size="30" name="" id="nome">
                                                  </div>
                                                  <div class="col-md-" style="padding-left: 10px">
                                                      <label for="CNPJ" >CNPJ</label><br>
                                                      <input type="text" size="24" class="form-control" name="" id="CNPJ">
                                                  </div>
                                              </div>
                                              <div class="row distanciamento">
                                                  <div class="col-md-">
                                                      <label for="telefone">telefone:<span style="color:#ff0000">*</span></label>
                                                      <input type="text" class="form-control" size="21" name="" id="telefone">
                                                  </div>
                                                  <div class="col-md-" style="padding-left: 10px ;">
                                                      <label for="diretor">diretor</label><br>
                                                      <input type="text" size="33" class="form-control" name="" id="diretor">
                                                  </div>
                                              </div>
                                              <div class="row distanciamento">
                                                  <div class="col-md-">
                                                      <label for="rede">Rede de Ensino:<span style="color:#ff0000">*</span></label>
                                                      <input type="text" placeholder="Solid , rock solid "size="59" class="form-control" name="" id="rede">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="offset-md-1 distanciamento row" style="" >
                                              <div class="col-md-" >
                                                  <label for="endereco">Endereço</label>
                                                  <input type="text" class="form-control" size="49" name="endereco" id="rede">
                                              </div>
                                              <div class="col-md-" style="padding-left: 10px ;">
                                                  <label for="numero">Numero</label>
                                                  <input type="text" class="form-control" size="5" name="numero" id="numero">
                                              </div>
                                              <div class="col-md-" style="padding-left: 10px ;">
                                                  <label for="bairro">Bairro</label>
                                                  <input type="text" class="form-control" size="24" name="bairro" id="bairro">
                                              </div>
                                          </div>
                                          <div class="offset-md-1  row">
                                              <div class="col-md-" >
                                                  <label for="complemento">Complemento</label>
                                                  <input type="text" class="form-control" size="50" name="endereço" id="complemento">
                                              </div>
                                              <div class="col-md-" style="padding-left: 10px ;">
                                                  <label for="cep">CEP</label>
                                                  <input type="text" class="form-control" size="32" name="cep" id="cep">
                                              </div>
                                          </div>
                                          <div class="offset-md-1 row distanciamento">
                                              <div class="col-md-" >
                                                  <label for="estado">Estado</label>
                                                  <input type="text" class="form-control" size="50" name="estado" id="estado">
                                              </div>
                                              <div class="col-md-" style="padding-left: 10px ;">
                                                  <label for="municipio">Municipio</label>
                                                  <input type="text" class="form-control" size="32" name="municipio" id="municipio">
                                              </div>
                                          </div>
                                      </div>
                          </div>
                              <div class="tab-pane fade aba-prof" id="escola-do-rock-prof" role="tabpanel" aria-labelledby="escola-do-rock-prof">
                                  <div class="row">
                                      <div class="container">
                                          <div class="offset-md-1 distanciamento col-md-" style="margin-top: 20px">
                                              <p>Professor <i class="far fa-question-circle"></i></p>
                                          </div>
                                          <div class="row">
                                              <div class="col-md-11">
                                                  <div class="offset-md-1 nome-prof row row-impar">
                                                      <div class="col-md-11">
                                                          MARIA DA SILVA FIGUEIREDO
                                                      </div>
                                                      <div class="col-md-1 item-tabela">
                                                          <a href=""><i class="fas fa-edit edit-ico"></i></a>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <br>
                          </div>
                  <div class="container">
                    <div class="row" style="margin-bottom: 10px">
                      <div class="col-md-1">
                        <a href="#">   <i class="far fa-trash-alt" style="color:#969696;"></i></a>
                      </div>
                      <div class="offset-md-10 col-md-1">
                        <a href=""><i class="fas fa-edit edit-ico" style="color: #969696;"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <!-- aqui termina o acordeon -->
          <div class="row row-impar">
            <div class="col-md-5 item-tabela ">
              Nossa escola
            </div>
            <div class="col-md-2 item-tabela ">
              acre
            </div>
            <div class="col-md-2 item-tabela">
              69692323666
            </div>
            <div class="col-md-2 item-tabela">
              2569 6969
            </div>
            <div class="col-md-1 item-tabela card">
               <a data-toggle="collapse" data-target="#collapse2" aria-expanded="true" aria-controls="collapse2" id="id-nossa-escola" onclick="seta('id-nossa-escola')">
                <i id="setinha" class="fas fa-angle-down"></i>
              </a>
            </div>
            <div class="container">
              <div class="row row-impar">
                <div id="collapse2" class="collapse col-md-12 item-tabela" role="tabpanel" data-parent="#accordion">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-12">
                        <ul class="nav nav-tabs abas" role="tablist">
                          <li class="nav-item ">
                            <a class="nav-link active " data-toggle="tab" href="#nossa-escola" role="tab" aria-controls="escola-do-rock" aria-selected="true">Dados da Gerais</a>
                          </li>
                          <li class="nav-item">
                            <button class="nav-link" data-toggle="tab" href="#nossa-escola-prof" aria-controls="scola-do-rock-prof" aria-selected="false" >Professores</button>
                          </li>
                        </ul>
                     </div>
                  </div>
                  <!-- aqui começa o conteudo das guias  -->
                  <div class="tab-content row-impar" >
                    <div class="tab-pane container active" id="nossa-escola">
                      <form>
                        <div class="row" style="margin-top: 30px">
                          <div class="offset-md-1 col-md-">
                            <img src="img/editar-foto.png" style="border:2px black;z-index: 0;">
                          </div>
                          <div class="offset-md-1 col-md-7">
                            <div class="row distanciamneto">
                              <div class=" col-md-">
                                <label for="nome" style="background-color: inherit;">Nome:<span style="color:#ff0000">*<span></label>
                                <input type="text" class="form-control" size="30" name="" id="nome">
                              </div>
                              <div class="col-md-" style="padding-left: 10px">
                                 <label for="CNPJ" >CNPJ</label><br>
                                    <input type="text" size="24" class="form-control" name="" id="CNPJ">
                              </div>
                            </div>
                            <div class="row distanciamento">
                              <div class="col-md-">
                                <label for="telefone">telefone:<span style="color:#ff0000">*</span></label>
                                <input type="text" class="form-control" size="21" name="" id="telefone">
                              </div>
                              <div class="col-md-" style="padding-left: 10px ;">
                                <label for="diretor">diretor</label><br>
                                <input type="text" size="33" class="form-control" name="" id="diretor">
                              </div>
                            </div>
                            <div class="row distanciamento">
                              <div class="col-md-">
                              <label for="rede">Rede de Ensino:<span style="color:#ff0000">*</span></label>
                                <input type="text" size="59" class="form-control" name="" id="rede">
                              </div>
                            </div> <!--fim da div dos dados ao lado da imagem-->
                          </div>
                          <div class="offset-md-1 row distanciamento" style="" >
                            <div class="col-md-" >
                              <label for="endereco">Endereço</label>
                                 <input type="text" class="form-control" size="49" name="endereco" id="rede">
                            </div>
                            <div class="col-md-" style="padding-left: 10px ;">
                              <label for="numero">Numero</label>
                                <input type="text" class="form-control" size="5" name="numero" id="numero">
                            </div>
                            <div class="col-md-" style="padding-left: 10px ;">
                              <label for="bairro">Bairro</label>
                              <input type="text" class="form-control" size="24" name="bairro" id="bairro">
                            </div>
                          </div>
                          <div class="offset-md-1 row distanciamento">
                            <div class="col-md-" >
                              <label for="complemento">complemento</label>
                              <input type="text" class="form-control" size="50" name="endereço" id="complemento">
                            </div>
                            <div class="col-md-" style="padding-left: 10px ;">
                              <label for="cep">CEP</label>
                              <input type="text" class="form-control" size="32" name="cep" id="cep">
                            </div>
                          </div>
                          <div class="offset-md-1 row distanciamento">
                            <div class="col-md-" >
                              <label for="estado">Estado</label>
                                <input type="text" class="form-control" size="50" name="estado" id="estado">
                            </div>
                            <div class="col-md-" style="padding-left: 10px ;">
                              <label for="municipio">Municipio</label>
                              <input type="text" class="form-control" size="32" name="municipio" id="municipio">
                            </div>
                          </div>
                        </div>
                      </div>
                     <!-- aqui termina o conteudo da guia do dados de escola  -->
                      <div class="tab-pane fade aba-prof" id="nossa-escola-prof" role="tabpanel" aria-labelledby="escola-do-rock-prof">
                        <div class="row">
                          <div class="container">
                            <div class="row">
                               <div class="container" style="margin-top: 20px" >
                                  <div class="offset-md-1 col-md-">
                                    <p>Professor <i class="far fa-question-circle"></i></p>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-11">
                                      <div class="offset-md-1 nome-prof row row-par">
                                        <div class="col-md-11">
                                          MARIA DA SILVA FIGUEIREDO
                                        </div>
                                        <div class="col-md-1 item-tabela">
                                         <a href=""><i class="fas fa-edit edit-ico"></i></a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-11">
                                      <div class="offset-md-1 nome-prof row row-par">
                                        <div class="col-md-11">
                                          TIAGO MATEUS BRUNO DA SILVA SILVEIRA
                                        </div>
                                        <div class="col-md-1 item-tabela">
                                         <a href=""> <i class="fas fa-edit edit-ico"></i></a>

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                               </div>
                              </div>
                            </div>
                          </div>
                          <br>
                        </div>
                        <div class="row" style="margin-bottom: 10px">
                          <div class="col-md-1">
                            <a href="#">   <i class="far fa-trash-alt" style="color:#969696;"></i></a>
                          </div>
                          <div class="offset-md-10 col-md-1">
                            <a href=""><i class="fas fa-edit edit-ico"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
             </div>
            </div><!--fim do acordeon , dropdowns que nao permitem 2 guias abertas ao mesmo tempo-->
          </div>

        <div class="row">
          <div class="col-md-12" style="margin-top:10px; ">
            <nav aria-label="Page navigation example" style="float:right;">
              <ul class="pagination justify-content-end">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1">Previous</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                   <a class="page-link" href="#">Next</a>
               </li>
              </ul>
            </nav>
          </div>
           </div>
        </div>
      </div>
    </div>
  </div>
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