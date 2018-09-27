<div id="janela_medalhas" style="margin-top: 9px;">
    <!-- Modal -->
<div class="modal fade" id="medalha_janela{{z['id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
            % for m in medalhas:
               <tr>
                 <th scope="row"> <img src="/static/img/medalha/socio/socio-{{m['image_name']}}.png" style="width: 118px; height: auto;"> </th>
                 <td colspan="2" position: absolute; > <div style="display: inline-flex">
                     <div class="descricao" style="width:274px;"><span>{{m['descricao_completa']}}</span></div>
                     <textarea maxlength="140" placeholder="Máximo 140 caracteres!"></textarea></div>
                    <button type="button" class="btn btn-cor" onclick="entregarMedalha({{z['id']}})" style="cursor: pointer;">Enviar</button>
                 </td>
               </tr>
            % end
         </tbody>
     </table>


       </div>

   </div>
 </div>
</div>
</div>
<!-- FECHANDO O MODEL DAR MEDALHAS -->