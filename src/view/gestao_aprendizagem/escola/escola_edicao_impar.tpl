<div class="col-md-5 item-tabela ">
  {{i['nome']}}
</div>
<div class="col-md-2 item-tabela ">
  {{i['vinculo_rede']}}
</div>
<div class="col-md-2 item-tabela">
  {{i['vinculo_diretor_escola']}}
</div>
<div class="col-md-2 item-tabela">
  {{i['telefone']}}
</div>
<div class="col-md-1 item-tabela card">
  <a data-toggle="collapse" data-target="#collapse{{i['id']}}" aria-expanded="true" aria-controls="collapse{{i['id']}}" id="id-nossa-escola" onclick="seta('id-nossa-escola')">
    <i id="setinha" class="fas fa-angle-down"></i>
  </a>
</div>
<div class="container">
  <div class="row row-impar">
    <div id="collapse{{i['id']}}" class="collapse col-md-12 item-tabela" role="tabpanel" data-parent="#accordion">
      <div class="card-body">
        <div class="row">
          <div class="col-md-12">
            <ul class="nav nav-tabs abas" role="tablist">
              <li class="nav-item ">
                <a class="nav-link active " data-toggle="tab" href="#nossa-escola" role="tab" aria-controls="escola-do-rock" aria-selected="true">Dados da Gerais</a>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-toggle="tab" href="#nossa-escola-prof" aria-controls="scola-do-rock-prof" aria-selected="false">Professores</button>
              </li>
            </ul>
          </div>
        </div>
        <!-- aqui começa o conteudo das guias  -->
        <div class="tab-content row-impar">
          <div class="tab-pane container active" id="nossa-escola">
            <form>
              <div class="row" style="margin-top: 30px">
                <div class="col-md-3">
                  <img src="/static/img/editar-foto.png" style="border:2px black;z-index: 0;">
                </div>
                <div class="col-md-9">
                  <div class="row distanciamneto">
                    <div class=" col-md-">
                      <label for="nome" style="background-color: inherit;">Nome:
                        <span style="color:#ff0000">*
                        <span>
                      </label>
                      <input type="text" class="form-control" size="30" name="" id="nome" value="{{i['nome']}}">
                    </div>
                    <div class="col-md-" style="padding-left: 10px">
                      <label for="CNPJ">CNPJ</label>
                      <br>
                      <input type="text" size="24" class="form-control" name="" id="CNPJ" value="{{i['cnpj']}}">
                    </div>
                  </div>
                  <div class="row distanciamento">
                    <div class="col-md-">
                      <label for="telefone">telefone:
                        <span style="color:#ff0000">*</span>
                      </label>
                      <input type="text" class="form-control" size="21" name="" id="telefone" value="{{i['telefone']}}">
                    </div>
                    <div class="col-md-" style="padding-left: 10px ;">
                      <label for="diretor">diretor</label>
                      <br>
                        <input type="text" size="33" class="form-control" name="" id="diretor" value="{{i['diretor']['nome']}}">
                    </div>
                  </div>
                  <div class="row distanciamento">
                    <div class="col-md-">
                      <label for="rede">Rede de Ensino:
                        <span style="color:#ff0000">*</span>
                      </label>
                      <input type="text" size="59" class="form-control" name="" id="rede" value="{{i['vinculo_rede']}}">
                    </div>
                  </div>
                  <!--fim da div dos dados ao lado da imagem-->
                </div>
                <div class="offset-md-1 row distanciamento" style="">
                  <div class="col-md-6">
                    <label for="endereco">Endereço</label>
                    <input type="text" class="form-control" size="49" name="endereco" id="rede" value="{{i['endereco']}}">
                  </div>
                  <div class="col-md-2" style="padding-left: 10px ;">
                    <label for="numero">Numero</label>
                    <input type="text" class="form-control" size="5" name="numero" id="numero" value="{{i['numero']}}">
                  </div>
                  <div class="col-md-4" style="padding-left: 10px ;">
                    <label for="bairro">Bairro</label>
                    <input type="text" class="form-control" size="24" name="bairro" id="bairro" value="{{i['bairro']}}">
                  </div>
                </div>
                <div class="offset-md-1 row distanciamento">
                  <div class="col-md-6">
                    <label for="complemento">complemento</label>
                    <input type="text" class="form-control" size="50" name="endereço" id="complemento" value="{{i['complemento']}}">
                  </div>
                  <div class="col-md-6" style="padding-left: 10px ;">
                    <label for="cep">CEP</label>
                    <input type="text" class="form-control" size="32" name="cep" id="cep" value="{{i['cep']}}">
                  </div>
                </div>
                <div class="offset-md-1 row distanciamento">
                  <div class="col-md-6">
                    <label for="estado">Estado</label>
                    <input type="text" class="form-control" size="50" name="estado" id="estado" value="{{i['estado']}}">
                  </div>
                  <div class="col-md-6" style="padding-left: 10px ;">
                    <label for="municipio">Municipio</label>
                    <input type="text" class="form-control" size="32" name="municipio" id="municipio" value="{{i['municipio']}}">
                  </div>
                </div>
              </div>
          </div>
          <!-- aqui termina o conteudo da guia do dados de escola  -->
          <div class="tab-pane fade aba-prof" id="nossa-escola-prof" role="tabpanel" aria-labelledby="escola-do-rock-prof">
            <div class="row">
              <div class="container">
                <div class="row">
                  <div class="container" style="margin-top: 20px">
                    <div class="offset-md-1 col-md-">
                      <p>Professor
                        <i class="far fa-question-circle"></i>
                      </p>
                    </div>
                    % for z in i['professor']:
                      <div class="row">
                        <div class="col-md-11">
                          <div class="offset-md-1 nome-prof row row-par">
                            <div class="col-md-11">
                                {{z['nome']}}
                            </div>
                            <div class="col-md-1 item-tabela">
                              <a href="">
                                <i class="fas fa-edit edit-ico"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    %end
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br>
        </div>
        <div class="row" style="margin-bottom: 10px">
          <div class="col-md-1">
            <a href="#">
              <i class="far fa-trash-alt" style="color:#969696;"></i>
            </a>
          </div>
          <div class="offset-md-10 col-md-1">
            <a href="">
              <i class="fas fa-edit edit-ico"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  </form>
</div>
