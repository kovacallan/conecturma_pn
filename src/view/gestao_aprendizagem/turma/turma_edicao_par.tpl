<!--informaçoes-->
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
<div class="col-md-1 item-tabela card colocar-direita">
    <a data-toggle="collapse" href="#collapse{{i['id']}}" aria-expanded="true" data-parent="#accordion"
       aria-controls="collapse{{i['id']}}"
       class="" id="id-escola-d-rock" onclick="seta('id-escola-d-rock')">
        <i id="setinha" class='fas fa-angle-down'></i>
    </a>
</div>

<!--fim das informaçoes da tabela-->

<!-- aqui começa os dados internos do acordeon -->
<div class="container">
    <div class="row row-par">
        <div id="collapse{{i['id']}}" class="collapse col-md-12 item-tabela" role="tabpanel"
             aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">

                <div class="row">
                    <div class="col-md-12">
                        <ul class="nav nav-tabs abas" role="tablist">
                            <li class="nav-item ">
                                <a class="nav-link active " data-toggle="tab" href="#{{i['id']}}" role="tab"
                                   aria-controls="escola-do-rock" aria-selected="true">Dados da Gerais</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#{{i['id']}}-prof"
                                   aria-controls="escola-do-rock-prof" aria-selected="false">Alunos
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- aqui começa o conteudo das guias  -->
                <div class="tab-content row-par">
                    <div class="tab-pane container active" id="{{i['id']}}">
                        <form>
                            <input type="hidden" id="id_turma{{i['id']}}" value="{{i['id']}}">
                            <div class="row distanciamento" style="margin-top: 30px">
                                <div class="col-md-12">
                                    <div class="row distanciamento">
                                        <div class=" col-md-6" style="margin-left: 10px;">
                                            <label for="nome" style="background-color: inherit;">Nome:
                                                <span style="color:red">*
                                                </span>
                                            </label>
                                            <input type="text" placeholder="Escola do rock" class="form-control disabled{{i['id']}}"
                                                   size="30" name="" id="nome{{i['id']}}" value="{{i['nome']}}" disabled>
                                        </div>
                                        <div class="col-md-4" style="padding-left: 10px">
                                            <label for="serie">serie</label>
                                            <br>
                                            <input type="text" size="24" class="form-control" name=""
                                                   id="serie{{i['id']}}" value="{{i['serie']}}" disabled>
                                        </div>
                                    </div>
                                    <div class="row distanciamento">
                                        <div class="col-md-10" style="margin-left: 10px;">
                                            <label for="telefone">escola:
                                                <span style="color:#ff0000">*</span>
                                            </label>
                                            <input type="text" class="form-control" size="21" name=""
                                                   id="escola{{i['id']}}" value="{{i['vinculo_escola']}}" disabled>
                                        </div>
                                    </div>
                                    <!--fim da div dos dados ao lado da imagem-->
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- aqui termina o conteudo da guia do dados de escola  -->
                    <div class="tab-pane fade aba-prof" id="{{i['id']}}-prof" role="tabpanel"
                         aria-labelledby="{{i['nome']}}-prof">
                        <div class="row">
                            <div class="container">
                                <div class="offset-md-1 distanciamento col-md-" style="margin-top: 20px">
                                    <p>Alunos
                                        <i class="far fa-question-circle"></i>
                                    </p>
                                    <div id="janela_medalhas">
                                        <button class="botao float-right" data-toggle="modal" data-target="#medalha_janela">Medalhas</button>
                                        <!-- conteudo do botao -->
                                        <!--MODAL PRIMARIO-->
                                        <div class="modal fade" id="medalha_janela" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                                            <div class="modal-dialog" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLongTitle">Medalhas obtidas</h5>


                                                        <button type="button" class="btn btn-primary" data-toggle="modal" id="dar-medalha" data-target="#modal-dar-medalha" data-dismiss="#medalha_janela" onclick="sumir()"
                                                            Dar medalhas
                                                        </button>

                                                        <!-- Modal -->

                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <table class="table table-bordered">
                                                            <thead>
                                                            <tr>
                                                                <th scope="col">Ação</th>
                                                                <th scope="col">Medalha</th>
                                                                <th scope="col">Descrição</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                                                                <td><img src="/static/img/medalha/jogo-11.gif" style="width:30%"></td>
                                                                <td></td>

                                                            </tr>
                                                            <tr>
                                                                <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                                                                <td><img src="/static/img/medalha/jogo-12.gif" style="width:30%"></td>
                                                                <td></td>

                                                            </tr>
                                                            <tr>
                                                                <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                                                                <td colspan="1"><img src="/static/img/medalha/jogo-13.gif" style="width:30%"></td>
                                                                <td></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Fim do conteúdo -->

                                    </div> <!--Fechando janela de medalhas -->

                                    <!-- MODAL DAR MEDALHAS-->
                                    <div class="modal fade" id="modal-dar-medalha" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"  aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <table class="table table-bordered">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col">Ação</th>
                                                            <th scope="col">Medalha</th>
                                                            <th scope="col">Descrição</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                                                            <td><img src="/static/img/medalha/socio/socio-10.gif" style="width:30%"></td>
                                                            <td></td>

                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                                                            <td><img src="/static/img/medalha/socio/socio-1.gif" style="width:30%"></td>
                                                            <td></td>

                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                                                            <td colspan="1"><img src="/static/img/medalha/socio/socio-2.gif" style="width:30%"></td>
                                                            <td></td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" id="botao-fechar" data-dismiss="modal">Fechar</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- FECHANDO O MODEL DAR MEDALHAS -->


                                </div>

                                % for z in i['aluno']:


                                <div class="row">
                                    <div class="col-md-11">

                                        <div class="offset-md-1 nome-prof row row-impar">
                                            <div class="col-md-5" style="padding-top: 10px;padding-bottom: 10px;">
                                                Nome: {{z['nome']}}
                                                <br>
                                                <br>
                                                Login :{{z['nome_login']}}
                                            </div>
                                            <div class="offset-md-1 col-md-6" style="padding:10px">

                                                <span style="margin-left:62px"> &nbsp;senha :</span>
                                                <br>
                                                <img src="/static/img/{{z['senha'][3]}}.png"
                                                     style="padding-left:11px;width: 15%;float:right;margin-right:5px;">
                                                <img src="/static/img/{{z['senha'][2]}}.png"
                                                     style="padding-left:11px;width: 15%;float:right;margin-right:5px;">

                                                <img src="/static/img/{{z['senha'][1]}}.png"
                                                     style="padding-left:11px;width: 15%;float:right;margin-right:5px;">

                                                <img src="/static/img/{{z['senha'][0]}}.png"
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
                        <span onclick="allow_edit({{i['id']}})" class="{{i['id']}}" id="icone_edit{{i['id']}}"
                              style="cursor:pointer;">
                            <i class="fas fa-edit edit-ico" style="color: #969696;padding-right: 27px;"></i>
                        </span>
                            <span onclick="update_turma({{i['id']}})" id="edit{{i['id']}}"
                                  style="cursor:pointer;display:none;">
                            <i class="far fa-save fa-lg" style="color: #969696;margin-left: -10px"></i>
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </form>
    </div>
</div>
<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
<script type="text/javascript">
function sumir(){

$('#modal-dar-medalha').on('show.bs.modal', function () {
    $('#medalha_janela').css('display','none');

});

$('#modal-dar-medalha').on('hidden.bs.modal', function () {
   $('#medalha_janela').css('display','block');
});
}
</script>