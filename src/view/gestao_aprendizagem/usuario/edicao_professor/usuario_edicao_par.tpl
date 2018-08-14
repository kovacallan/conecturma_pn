<!--informaçoes-->
<div class="col-md-4 item-tabela ">
    {{i['nome']}}
</div>
<div class="col-md-3 item-tabela ">
    {{i['email']}}
</div>
<div class="col-md-2 item-tabela">
    {{i['vinculo_escola']}}
</div>
<div class="col-md-2 item-tabela">
    {{i['tipo']}}
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
                            <div class="col-md-12">
                                <div class="row distanciamento" style="margin-left: 5px;">
                                    <div class=" col-md-">
                                        <label for="nome" style="background-color: inherit;">Nome:
                                            <span style="color:red">*
                                                <span></span>
                                        </label>
                                        <input type="text" placeholder="Escola do rock" class="form-control" size="30" name="" id="nome{{i['id']}}" value="{{i['nome']}}">
                                    </div>
                                    <div class="col-md-" style="padding-left: 10px">
                                        <label for="data">Data de nascimeto</label>
                                        <span style="color:#ff0000">*</span>
                                        <br>
                                        <input type="date" size="25" class="form-control"  name="" id="aluno_nascimento" value="{{i['nascimento']}}" onchange="document.getElementById('aluno_nascimento').style.boxShadow = 'none'">
                                    </div>
                                    <div class="col-md-" style="padding-left: 10px">
                                        <label for="telefone">Sexo</label>
                                        <select id="aluno_sexo" class="custom-select custom-select-md">
                                            <option value="1">Masculino</option>
                                            <option value="2">Feminino</option>
                                        </select>
                                    </div>
                                </div>
                                <h5>Acesso</h5>
                                <div class="row distanciamento" style="margin-left: 5px;">

                                    <div col="col-md-">
                                        <label for="login">Email</label>
                                        <span style="color:#ff0000">*</span>
                                        <input type="text" size="25" class="form-control"  name="" id="aluno_nascimento" value="{{i['email']}}">
                                    </div>
                                </div>
                                <!--fim da div dos dados ao lado da imagem-->
                            </div>
                        </div>
                </div>
                <!-- aqui termina o conteudo da guia do dados de escola  -->

                <br>
            </div>
            <div class="container">
<<<<<<< HEAD
                <div class="row" style="margin-bottom: 10px">
                    <!--%if tipo != '2':-->
                                                                            <!--<div class="col-md-1">-->
                                                                            <!--<span onclick="delete_estrutura({{i['id']}})" style="cursor:pointer;">-->
                                                                            <!--<i class="far fa-trash-alt" style="color:#969696;"></i>-->
                                                                            <!--</span>-->
                                                                            <!--</div>-->
                    <!--%end-->
=======
                <!--<div class="row" style="margin-bottom: 10px">

                            <div class="col-md-1">
                                <span onclick="delete_estrutura({{i['id']}})" style="cursor:pointer;">
                                    <i class="far fa-trash-alt" style="color:#969696;"></i>
                                </span>
                            </div>

>>>>>>> 50b1f8c6ce76d3fd04803265ff1de11c503627ad
                    <div class="offset-md-10 col-md-1">
                        <span onclick="update_escola({{i['id']}})" style="cursor:pointer;">
                            <i class="fas fa-edit edit-ico" style="color: #969696;"></i>
                        </span>
                    </div>
                </div>-->
            </div>
        </div>
    </div>
    </form>
</div>
</div>
