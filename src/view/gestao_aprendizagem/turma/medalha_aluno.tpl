<div id="janela_medalhas" style="margin-top: 9px;">
    <!-- conteudo do botao -->
    <!--MODAL PRIMARIO-->
    <div class="modal fade" id="medalha_janela{{z['id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="">Medalhas obtidas</h5>


                    <button type="button" class="btn btn-primary" data-toggle="modal" id="dar-medalha" data-target="#modal-dar-medalha{{z['id']}}" data-dismiss="#medalha_janela" onclick="sumir()"
                    style="margin-left: 247px;cursor: pointer;">
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
                        % medalha = []
                        % if z['medalha'] != []:
                            % for m in z['medalha']:
                                % if m['id'] not in medalha:
                                    % if m['tipo_medalha'] == '2':
                                        <tr>
                                            <th scope="row"><!--<input type="checkbox" name="vehicle1" value="">--></th>
                                            <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/jogo-{{m['image_name']}}.png" ></td>
                                            <td class="w-descricao">{{m['descricao_completa']}}</td>
                                        </tr>
                                    % else:
                                        <tr>
                                            <th scope="row"><!--<input type="checkbox" name="vehicle1" value="">--></th>
                                            <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/socio/socio-{{m['image_name']}}.png" ></td>
                                            <td class="w-descricao">{{m['descricao_completa']}}</td>
                                        </tr>
                                    % end
                                % medalha.append(m['id'])
                                % end
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
                        % for m in medalhas:
                            <tr>
                                <th scope="row"><input id="idMedalha_{{m['id']}}" onChange="getIdMedalha('{{m['id']}}')" type="checkbox"></th>
                                <td style="width: 1px;"><img class="img-resize" src="/static/img/medalha/socio/socio-{{m['image_name']}}.png" ></td>
                                <td class="w-descricao">{{m['descricao_completa']}}</td>
                                <td> <textarea id="medalha_motivo_{{m['id']}}" class="w-motivo" maxlenght=140 placeholder="Max 140 caracteres"></textarea></td>
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


