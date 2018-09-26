<div id="janela_medalhas" style="margin-top: 9px;">
<button class="botao" data-toggle="modal" data-target="#medalha_janela{{z['id']}}" style="cursor: pointer;">Medalhas</button>
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
<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
   <div class="modal-dialog" role="document"   style="margin: 0px 0 0 20%;">
      <div class="modal-content tamanho">
         <div class="modal-body">
            <table class="table table-borderless">
               <div class="table-head" style="margin-bottom: 10px; width: 102%">
                  <h5>Medalha</h5>
                  <h5 id="header-2">Competência</h5>
                  <h5 style="margin-left: 200px;">Comentário</h5>
               </div>
               <tbody>
                  <tr>
                     <th scope="row"> <img src="img/socio/socio-1.png" style="width: 118px; height: auto;"> </th>
                     <td colspan="2" position: absolute; >
                        <div style="display: inline-flex">
                           <div class="descricao" style="width:274px;"><span>Pensamento crítico. Estimulamos a curiosidade e o gosto por aventura</span></div>
                           <textarea maxlength="140" placeholder="Máximo 140 caracteres!"></textarea>
                        </div>
                        <button type="button" class="btn btn-cor" style="">Enviar</button>
                     </td>
                  </tr>
            </table>
         </div>
      </div>
   </div>
</div>
<!-- FECHANDO O MODEL DAR MEDALHAS -->