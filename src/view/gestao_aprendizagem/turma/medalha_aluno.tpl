<div id="janela_medalhas" style="margin-top: 9px;">
    <button class="botao" data-toggle="modal" data-target="#medalha_janela" style="cursor: pointer;">Medalhas</button>
    <!-- conteudo do botao -->
    <!--MODAL PRIMARIO-->
    <div class="modal fade" id="medalha_janela" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Medalhas obtidas</h5>


                    <button type="button" class="btn btn-primary" data-toggle="modal" id="dar-medalha" data-target="#modal-dar-medalha" data-dismiss="#medalha_janela" onclick="sumir()"
                    style="margin-left: 85px;cursor: pointer;">
                        Dar medalhas
                    </button>

                    <!-- Modal -->

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="cursor: pointer;">
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
                            <!--<th scope="row"><input type="checkbox" name="vehicle1" value=""></th>-->
                            <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/jogo-11.gif" ></td>
                            <td class="w-descricao"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" style="cursor: pointer;">Fechar</button>
                </div>
            </div>
        </div>
    </div>
</div>
        <!-- Fim do conteúdo -->


<!--Fechando janela de medalhas -->

    <!-- MODAL DAR MEDALHAS-->
<div class="modal fade" id="modal-dar-medalha" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="cursor: pointer;">
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
                        <th scope="col"> Motivo</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                        <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/socio/socio-10.gif" ></td>
                        <td class="w-descricao"></td>
                        <td> <textarea class="w-motivo" maxlenght=140 placeholder="Max 140 caracteres"></textarea></td>

                    </tr>
                    <tr>
                        <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                        <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/socio/socio-1.gif" ></td>
                        <td class="w-descricao"></td>
                        <td> <textarea class="w-motivo" maxlenght=140 placeholder="Max 140 caracteres"></textarea></td>

                    </tr>
                    <tr>
                        <th scope="row"><input type="checkbox" name="vehicle1" value=""></th>
                        <td colspan="1"  style="width: 1px;"|><img class="img-resize" src="/static/img/medalha/socio/socio-2.gif" ></td>
                        <td class="w-descricao"></td>
                        <td> <textarea class="w-motivo" maxlenght=140 placeholder="Max 140 caracteres"></textarea></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="botao-fechar" data-dismiss="modal" style="cursor: pointer;">Fechar</button>

            </div>
        </div>
    </div>
</div>

    <!-- FECHANDO O MODEL DAR MEDALHAS -->

