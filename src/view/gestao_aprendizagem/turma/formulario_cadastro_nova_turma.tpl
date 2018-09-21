<!--div da nova escola-->
    <div class="row row-impar">
        <div class="col-md-11 item-tabela-h" style="color:black">
            nova turma
        </div>
        <div class="col-md-1 item-tabela">
            <button id="dads" class="normalizar-botao" onclick="test(this.id);">
                <i class='fas fa-angle-up'></i>
            </button>
        </div>
    </div>
    <div class="row row-impar" id="nova-escola" style="display: block">
        <div class="container">
            <div id="teste" class="row new-scola">
                <!--conteudo interno do botao a partir daqui-->
                <div class="col-md-12">
                    <ul class="nav nav-tabs abas" role="tablist">
                        <li class="nav-item ">
                            <a class="nav-link active " data-toggle="tab" href="#dados-da-escola" role="tab" aria-controls="dados-da-escola" aria-selected="true">Dados da Gerais</a>
                        </li>
                    </ul>
                </div>

                <!-- aqui começa o conteudo das guias(navlink)  -->
                <div class="tab-content row-impar" id="nav-tabContent">
                    <div class="row">
                        <div class="tab-pane fade show active container active" role="tabpanel" aria-labelledby="home-tab" id="dados-da-escola">
                            <div class="row distanciamneto" style="margin-top: 30px; margin-left: 10px;
">
                                <div class="col-md-12">
                                    <div class="row distanciamneto">
                                        <div class=" col-md-6">
                                            <label for="nome" style="background-color: inherit;">Nome:
                                                <span style="color:#ff0000">*</span>
                                            </label>
                                            <input style="height: 38px;" type="text" class="form-control" size="30" name="" id="nome" onchange="document.getElementById('nome').style.boxShadow = 'none'" value="">
                                        </div>
                                        <div class="col-md-4" style="padding-left: 10px">
                                            <label for="serie">Série</label>
                                            <span style="color:#ff0000">*</span>
                                            <select class="custom-select" name="serie" id="serie" aria-label="Example select with button addon">
                                                 <option value="0">pré-escola</option>
                                                 <option value="1">1ª Ano</option>
                                                 <option value="2">2ª Ano</option>
                                                 <option value="3">3ª Ano</option>
                                             </select>
                                        </div>
                                    </div>
                                    <!--fim da div dos dados ao lado da imagem-->
                                </div>
                                <div class=" col-md-6">
                                    <label for="escola" style="margin-top: 13px; background-color: inherit;">Escola:
                                        <span style="color:#ff0000">*</span>
                                    </label>
                                    <select class="custom-select" name="escola" id="escola" aria-label="Example select with button addon">
                                        % if isinstance(escola, list):
                                            % for i in escola:
                                                <option value="{{i['id']}}">{{i['nome']}}</option>
                                            %end
                                        % else:
                                            <option value="{{escola['id']}}">{{escola['nome']}}</option>
                                        % end
                                    </select>
                                </div>
                                <br>
                                 <div class=" col-md-4">
                                            <label for="data_de_criacao" style="margin-top: 13px"> Data de Criação:

                                            </label>
                                            <input style="height: 38px;" type="text" class="form-control" size="30" name="" id="data_de_criacao"  value="" disabled>
                                        </div>
                            </div>
                        </div>
                        <!-- aqui termina o conteudo da guia do dados de escola  -->
                        <br>
                    </div>
                    <div class="container" style="margin-top:20px;margin-bottom: 20px">
                        <div class="row">
                            <div class="offset-md-9 distanciamento">
                                <button type="submit" class="botao-salvar" onclick="cadastro_turma()" style="margin-left: 10px;">salvar</button>
                                <button class="botao-salvar" style="background-color:#ff0000" onclick='document.getElementById("new_school").style.display = "none"'>cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--fim do nova escola-->
            <!-- acordeon -->
        </div>
    </div>
<script>
    date = new Date;
    document.getElementById('data_de_criacao').value = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
</script>