
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
                </div>
                <br>
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