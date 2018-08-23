<div class="col-md-5 item-tabela ">
    {{i['nome']}}
</div>
<div class="col-md-2 item-tabela ">
    {{i['professor']}}
</div>
<div class="col-md-2 item-tabela">
    {{i['vinculo_escola']}}
</div>
<div class="col-md-2 item-tabela">
    {{i['serie']}}
</div>
<div class="col-md-1 item-tabela card">
    <a data-toggle="collapse" data-target="#collapse{{i['id']}}" aria-expanded="true"
       aria-controls="collapse{{i['id']}}" id="id-nossa-escola" onclick="seta('id-nossa-escola')">
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
                                <a class="nav-link active " data-toggle="tab" href="#nossa-escola" role="tab"
                                   aria-controls="escola-do-rock" aria-selected="true">Dados da Gerais</a>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-toggle="tab" href="#nossa-escola-prof"
                                        aria-controls="scola-do-rock-prof" aria-selected="false">Alunos
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- aqui começa o conteudo das guias  -->
                <div class="tab-content row-impar">
                    <div class="tab-pane container active" id="nossa-escola">
                        <form>
                            <input type="hidden" id="id_turma{{i['id']}}" value="{{i['id']}}">
                            <div class="row" style="margin-top: 30px">
                                <div class="col-md-3">
                                    <img src="/static/img/editar-foto.png" style="border:2px black;z-index: 0;">
                                </div>
                                <div class="col-md-9">
                                    <div class="row distanciamneto">
                                        <div class=" col-md-">
                                            <label for="nome" style="background-color: inherit;">Nome:
                                                <span style="color:#ff0000">*
                                                </span>
                                            </label>
                                            <input type="text" class="form-control" size="30" name=""
                                                   id="nome{{i['id']}}" value="{{i['nome']}}">
                                        </div>
                                        <div class="col-md-" style="padding-left: 10px">
                                            <label for="CNPJ">CNPJ</label>
                                            <br>
                                            <input type="text" size="24" class="form-control" name=""
                                                   id="cnpj{{i['id']}}" value="{{i['cnpj']}}">
                                        </div>
                                    </div>
                                    <div class="row distanciamento">
                                        <div class="col-md-">
                                            <label for="telefone">telefone:
                                                <span style="color:#ff0000">*</span>
                                            </label>
                                            <input type="text" class="form-control" size="21" name=""
                                                   id="telefone{{i['id']}}" value="{{i['telefone']}}">
                                        </div>
                                        <div class="col-md-" style="padding-left: 10px ;">
                                            <label for="gestor">gestor</label>
                                            <br>
                                            <input type="text" size="33" class="form-control" name=""
                                                   id="diretor{{i['id']}}" value="{{i['professor']}}">
                                        </div>
                                    </div>
                                    <!--fim da div dos dados ao lado da imagem-->
                                </div>
                                <div class="offset-md-1 row distanciamento" style="">
                                    <div class="col-md-6">
                                        <label for="endereco">Endereço</label>
                                        <input type="text" class="form-control" size="49" name="endereco"
                                               id="endereco{{i['id']}}" value="{{i['endereco']}}">
                                    </div>
                                    <div class="col-md-2" style="padding-left: 10px ;">
                                        <label for="numero">Numero</label>
                                        <input type="text" class="form-control" size="5" name="numero"
                                               id="numero{{i['id']}}" value="{{i['numero']}}">
                                    </div>
                                    <div class="col-md-4" style="padding-left: 10px ;">
                                        <label for="bairro">Bairro</label>
                                        <input type="text" class="form-control" size="24" name="bairro"
                                               id="bairro{{i['id']}}" value="{{i['bairro']}}">
                                    </div>
                                </div>
                                <div class="offset-md-1 row distanciamento">
                                    <div class="col-md-6">
                                        <label for="complemento">complemento</label>
                                        <input type="text" class="form-control" size="50" name="endereço"
                                               id="complemento{{i['id']}}" value="{{i['complemento']}}">
                                    </div>
                                    <div class="col-md-6" style="padding-left: 10px ;">
                                        <label for="cep">CEP</label>
                                        <input type="text" class="form-control" size="32" name="cep" id="cep{{i['id']}}"
                                               value="{{i['cep']}}">
                                    </div>
                                </div>
                                <div class="offset-md-1 row distanciamento">
                                    <div class="col-md-6">
                                        <label for="estado">Estado</label>
                                        <input type="text" class="form-control" size="50" name="estado"
                                               id="estado{{i['id']}}" value="{{i['estado']}}">
                                    </div>
                                    <div class="col-md-6" style="padding-left: 10px ;">
                                        <label for="municipio">Municipio</label>
                                        <input type="text" class="form-control" size="32" name="municipio"
                                               id="municipio{{i['id']}}" value="{{i['municipio']}}">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- aqui termina o conteudo da guia do dados de escola  -->
                    <div class="tab-pane fade aba-prof" id="nossa-escola-prof" role="tabpanel"
                         aria-labelledby="escola-do-rock-prof">
                        <div class="container">
                            <div class="row">


                                <div class="offset-md-1 distanciamento col-md-" style="margin-top: 20px">
                                    <p>Alunos
                                        <i class="far fa-question-circle"></i>
                                    </p>
                                </div>
                            </div>

                            % for z in i['aluno']:


                            <div class="row">
                                <div class="col-md-11">
                                    <div class="offset-md-1 nome-prof row row-par">
                                        <div class="col-md-5" style="padding-top: 10px;padding-bottom: 10px;">
                                            Nome: {{z['nome']}}

                                            <br>
                                            Login :{{z['nome_login']}}
                                        </div>
                                        <div class="offset-md-1 col-md-6" style="padding:10px">

                                            <span style="margin-left:62px"> &nbsp;senha :</span>
                                            <br>
                                            <img src="/static/img/{{z['senha'][0]}}.png"
                                                 style="padding-left:11px;width: 15%;float:right;margin-right:5px;">
                                            <img src="/static/img/{{z['senha'][1]}}.png"
                                                 style="padding-left:11px;width: 15%;float:right;margin-right:5px;">
                                            <img src="/static/img/{{z['senha'][2]}}.png"
                                                 style="padding-left:11px;width: 15%;float:right;margin-right:5px;">
                                            <img src="/static/img/{{z['senha'][3]}}.png"
                                                 style="padding-left:11px;width: 15%;float:right;margin-right:5px;">

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
              <i class="fas fa-edit edit-ico"></i>
            </span>
                </div>
            </div>
        </div>
    </div>
</div>

</div>
