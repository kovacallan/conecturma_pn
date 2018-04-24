%include('./header.tpl', title = 'Conecturma')
  <div class="row">
    <div align="center" class="col-md-12">

        <div align="right">
            <a href="/">
                <button>voltar</button>
            </a>
        </div>
        <h1>Listagem de Usuários</h1>
         <div class="col-md-4">
            <div class="row">
                <form action="usuario/redirect_cadastro">
                    %include('bottle/usuario/bottle_usuario_cadastro.tpl')
                    <button type="submit" >+ Usuário</button>
                </form>
            </div>
        </div>
         <div class="col-md-8">
            <div class="row">
                %include('bottle/usuario/bottle_usuario_filtros.tpl')
                <button id="botao-filtro" onclick="filtro_usuario()">Filtrar</button>
            </div>
         </div>
        <br>
        <div class="row">
            <div class="col-md-2">
                <strong>Nome</strong>
            </div>
            <div class="col-md-2">
                <strong>CPF</strong>
            </div>
            <div class="col-md-2">
                <strong>Escola</strong>
            </div>
            <div class="col-md-2">
                <strong>Rede</strong>
            </div>
            <div class="col-md-2">
                <strong>Tipo</strong>
            </div>
       </div>
       <div id="usuarios_sistema">
          %include('bottle/usuario/bottle_usuario_read_usuarios')
         </div>
     </div>
</div>
%include('footer.tpl')