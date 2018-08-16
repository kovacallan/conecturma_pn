<!--informaçoes-->
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
                            <button class="nav-link" data-toggle="tab" href="#{{i['id']}}-prof" aria-controls="escola-do-rock-prof" aria-selected="false">Professores</button>
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
                            <div class="col-md-3">
                                <img src="/static/img/editar-foto.png" style="border:2px black;z-index: 0;">
                            </div>
                            <div class="col-md-9">
                                <div class="row distanciamento">
                                    <div class=" col-md-">
                                        <label for="nome" style="background-color: inherit;">Nome:
                                            <span style="color:red">*
                                                <span>
                                        </label>
                                        <input type="text" placeholder="Escola do rock" class="form-control" size="30" name="" id="nome{{i['id']}}" value="{{i['nome']}}">
                                    </div>
                                    <div class="col-md-" style="padding-left: 10px">
                                        <label for="CNPJ">CNPJ</label>
                                        <br>
                                        <input type="text" size="24" class="form-control" name="" id="cnpj{{i['id']}}" value="{{i['cnpj']}}">
                                    </div>
                                </div>
                                <div class="row distanciamento">
                                    <div class="col-md-">
                                        <label for="telefone">telefone:
                                            <span style="color:#ff0000">*</span>
                                        </label>
                                        <input type="text" class="form-control" size="21" name="" id="telefone{{i['id']}}" value="{{i['telefone']}}">
                                    </div>
                                    <div class="col-md-" style="padding-left: 10px ;">
                                        <label for="diretor">diretor</label>
                                        <br>
                                        <input type="text" size="33" class="form-control" name="" id="diretor{{i['id']}}" value="{{i['vinculo_diretor_escola']}}">
                                    </div>
                                </div>
                                <div class="row distanciamento">
                                    <div class="col-md-">
                                        <label for="rede">Rede de Ensino:

                                        </label>
                                        % if i['vinculo_rede'] != '0':
                                            <input type="hidden" size="59" class="form-control" name="" id="rede{{i['id']}}" value="{{i['vinculo_rede_id']}}">
                                            <input type="text" size="59" class="form-control" name="" value="{{i['vinculo_rede']}}">
                                        % else:
                                            <input type="text" size="59" class="form-control" name="" value=" ">
                                        %end
                                    </div>
                                </div>
                                <!--fim da div dos dados ao lado da imagem-->
                            </div>
                            <div class="offset-md-1 distanciamento row" style="">
                                <div class="col-md-6">
                                    <label for="endereco">Endereço</label>
                                    <input type="text" class="form-control" size="49" name="endereco" id="endereco{{i['id']}}" value="{{i['endereco']}}">
                                </div>
                                <div class="col-md-2" style="padding-left: 10px ;">
                                    <label for="numero">Numero</label>
                                    <input type="text" class="form-control" size="5" name="numero" id="numero{{i['id']}}" value="{{i['numero']}}">
                                </div>
                                <div class="col-md-4" style="padding-left: 10px ;">
                                    <label for="bairro">Bairro</label>
                                    <input type="text" class="form-control" size="24" name="bairro" id="bairro{{i['id']}}" value="{{i['bairro']}}">
                                </div>
                            </div>
                            <div class="offset-md-1  row">
                                <div class="col-md-6">
                                    <label for="complemento">Complemento</label>
                                    <input type="text" class="form-control" size="50" name="endereço" id="complemento{{i['id']}}" value="{{i['complemento']}}">
                                </div>
                                <div class="col-md-6" style="padding-left: 10px ;">
                                    <label for="cep">CEP</label>
                                    <input type="text" class="form-control" size="32" name="cep" id="cep{{i['id']}}" value="{{i['cep']}}">
                                </div>

                            </div>
                            <div class="offset-md-1 row distanciamento">
                                <div class="col-md-6">
                                    <label for="estado">Estado</label>
                                    <input type="text" class="form-control" size="50" name="estado" id="estado{{i['id']}}" value="{{i['estado']}}">
                                </div>
                                <div class="col-md-6" style="padding-left: 10px ;">
                                    <label for="municipio">Municipio</label>
                                    <input type="text" class="form-control" size="32" name="municipio" id="municipio{{i['id']}}" value="{{i['municipio']}}">
                                </div>
                            </div>
                        </div>
                </div>
                <!-- aqui termina o conteudo da guia do dados de escola  -->
                <div class="tab-pane fade aba-prof" id="{{i['id']}}-prof" role="tabpanel" aria-labelledby="{{i['nome']}}-prof">
                    <div class="row">
                        <div class="container">
                            <div class="offset-md-1 distanciamento col-md-" style="margin-top: 20px">
                                <p>Professor
                                    <i class="far fa-question-circle"></i>
                                </p>
                            </div>
                            % for z in i['professor']:
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
                        <span onclick="update_escola({{i['id']}})" style="cursor:pointer;">
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
