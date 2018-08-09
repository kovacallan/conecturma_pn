<!--informaçoes-->
<div class="col-md-5 item-tabela ">
    {{i['nome']}}
</div>
<div class="col-md-2 item-tabela ">

</div>
<div class="col-md-2 item-tabela">
    {{i['vinculo_escola']}}
</div>
<div class="col-md-2 item-tabela">
    {{i['serie']}}
</div>
<div class="col-md-1 item-tabela card colocar-direita">
    <a data-toggle="collapse" href="#collapse{{i['id']}}" aria-expanded="true" data-parent="#accordion" aria-controls="collapse{{i['id']}}"
        class="" id="id-escola-d-rock" onclick="seta('id-escola-d-rock')">
        <i id="setinha" class='fas fa-angle-down'></i>
    </a>
</div>

<!--fim das informaçoes da tabela-->

<!-- aqui começa os dados internos do acordeon -->
<div class="container">
    <div class="row row-par">
    <div id="collapse{{i['id']}}" class="collapse col-md-12 item-tabela" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">
        <div class="card-body">

            <div class="row">
                <div class="col-md-12">
                    <ul class="nav nav-tabs abas" role="tablist">
                        <li class="nav-item ">
                            <a class="nav-link active " data-toggle="tab" href="#{{i['id']}}" role="tab" aria-controls="escola-do-rock" aria-selected="true">Dados da Gerais</a>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-toggle="tab" href="#{{i['id']}}-prof" aria-controls="escola-do-rock-prof" aria-selected="false">Escolas</button>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- aqui começa o conteudo das guias  -->
            <div class="tab-content row-par">
                <div class="tab-pane container active" id="{{i['id']}}">
                    <form>
                        <input type="hidden" id ="id_escola{{i['id']}}" value="{{i['id']}}">
                        <div class="row distanciamento" style="margin-top: 30px">
                            <div class="col-md-12">
                                <div class="row distanciamento">
                                    <div class=" col-md-6" style="margin-left: 10px;">
                                        <label for="nome" style="background-color: inherit;">Nome:
                                            <span style="color:red">*
                                                <span>
                                        </label>
                                        <input type="text" placeholder="Escola do rock" class="form-control" size="30" name="" id="nome{{i['id']}}" value="{{i['nome']}}">
                                    </div>
                                    <div class="col-md-4" style="padding-left: 10px">
                                        <label for="CNPJ">serie</label>
                                        <br>
                                        <input type="text" size="24" class="form-control" name="" id="serie{{i['id']}}" value="{{i['serie']}}">
                                    </div>
                                </div>
                                <div class="row distanciamento">
                                    <div class="col-md-10" style="margin-left: 10px;">
                                        <label for="telefone">escola:
                                            <span style="color:#ff0000">*</span>
                                        </label>
                                        <input type="text" class="form-control" size="21" name="" id="escola{{i['id']}}" value="{{i['vinculo_escola']}}">
                                    </div>
                                </div>
                                <!--fim da div dos dados ao lado da imagem-->
                            </div>
                        </div>
                    </form>
                </div>
                <!-- aqui termina o conteudo da guia do dados de escola  -->
                <div class="tab-pane fade aba-prof" id="{{i['id']}}-prof" role="tabpanel" aria-labelledby="{{i['nome']}}-prof">
                    <div class="row">
                        <div class="container">
                            <div class="offset-md-1 distanciamento col-md-" style="margin-top: 20px">
                                <p>Escolas
                                    <i class="far fa-question-circle"></i>
                                </p>
                            </div>
                            %for z in i['professor']:
                                <div class="row">
                                    <div class="col-md-11">
                                        <div class="offset-md-1 nome-prof row row-impar">
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
                <br>
            </div>
            <div class="container">
                <div class="row" style="margin-bottom: 10px">
                    % if tipo != '2':
                        <div class="col-md-1">
                            <span onclick="delete_estrutura({{i['id']}})" style="cursor:pointer;">
                                <i class="far fa-trash-alt" style="color:#969696;"></i>
                            </span>
                        </div>
                    % end
                    <div class="offset-md-10 col-md-1">
                        <span onclick="update_rede({{i['id']}})" style="cursor:pointer;">
                            <i class="fas fa-edit edit-ico" style="color: #969696;"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </form>
</div>
</div>
