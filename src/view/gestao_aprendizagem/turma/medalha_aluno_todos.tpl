<button type="button" class="botao float-right" data-toggle="modal" data-target="#medalha_todos">Dar medalhas a todos os alunos</button>
<!-- conteudo do botao -->
<!--MODAL PRIMARIO-->
<div class="modal fade" id="medalha_todos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle"> Dar Medalhas </h5>
                <!-- Modal -->

            <div class="offset-md-5">
                <button class="botao" onclick="entregarMedalhaTodos({{i['id']}})" style="cursor: pointer;">Entregar Medalha</button>
            </div>
            </div>
            <div class="modal-body">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">Ação</th>
                        <th scope="col">Medalha</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Motivo</th>
                    </tr>
                    </thead>
                    <tbody>
                        % for m in medalhas:
                            <tr>
                                <th scope="row"><input id="idMedalha_{{m['id']}}" onChange="getIdMedalha('{{m['id']}}')" type="checkbox"></th>
                                <td  style="width: 1px;"><img class="img-resize" src="/static/img/medalha/socio/socio-{{m['image_name']}}.png" ></td>
                                <td class="w-descricao">{{m['descricao_completa']}}</td>
                                <td><textarea id="medalha_motivo_{{m['id']}}" class="w-motivo" maxlenght=140 placeholder="Max 140 caracteres"></textarea></td>
                            </tr>
                        % end
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