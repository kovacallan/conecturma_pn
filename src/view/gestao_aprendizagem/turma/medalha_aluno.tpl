<div id="janela_medalhas" style="margin-top: 9px;">
    <button class="botao" data-toggle="modal" data-target="#medalha_janela{{z['id']}}" style="cursor: pointer;">Medalhas</button>
    <!-- conteudo do botao -->
    <!--MODAL PRIMARIO-->
    <div class="modal fade" id="medalha_janela{{z['id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Medalhas obtidas</h5>


                    <button type="button" class="btn btn-primary" data-toggle="modal" id="dar-medalha" data-target="#modal-dar-medalha{{z['id']}}" data-dismiss="#medalha_janela" onclick="sumir()"
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
                            <th scope="col"></th>
                            <th scope="col">Medalha</th>
                            <th scope="col">Descrição</th>
                        </tr>
                        </thead>
                        <tbody>
                        % if z['medalha'] != []:
                            % for m in z['medalha']:
                                <tr>
                                    <th scope="row"><!--<input type="checkbox" name="vehicle1" value="">--></th>
                                    <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/jogo-{{m['image_name']}}.gif" ></td>
                                    <td class="w-descricao">{{m['descricao_completa']}}</td>
                                </tr>
                            % end
                        % end
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
<div class="modal fade" id="modal-dar-medalha{{z['id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"></h5>
                <div class="offset-md-9">
                    <button class="botao" onclick="entregarMedalha({{z['id']}})" style="cursor: pointer;">Entregar Medalha</button>
                </div>
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
                        % for q in medalhas:
                            <tr>
                                <th scope="row"><input id="idMedalha" onChange="idMedalha(this)" type="checkbox" name="vehicle1" value="{{q['id']}}"></th>
                                <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/socio/socio-{{q['image_name']}}.gif" ></td>
                                <td class="w-descricao">{{q['descricao_completa']}}</td>
                                <td> <textarea class="w-motivo" maxlenght=140 placeholder="Max 140 caracteres"></textarea></td>
                            </tr>
                        % end
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


