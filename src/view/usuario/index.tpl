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
                <form action="/gestao_aprendizagem/usuario/redirect_cadastro">
                    %include('bottle/usuario/bottle_usuario_cadastro.tpl')
                    <button type="submit" >+ Usuário</button>
                </form>
            </div>
        </div>
         <div align="center" class="col-md-12">
            <div class="row">
                <!-- %include('bottle/usuario/bottle_usuario_filtros.tpl') -->
               <!-- <button id="botao-filtro" onclick="filtro_usuario()">Filtrar</button> -->
            </div>
         </div>
        <br>
        <div class="row">
            <div class="col-md-2">
                <strong>Nome</strong>
            </div>
            <div class="col-md-2">
                <strong>Email</strong>
            </div>
            <div class="col-md-2">
                <strong>Turma</strong>
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

<script>

function filtro_usuario(){
   filtro_escola = document.getElementById('filtro_escola').value;

   filtro_rede = document.getElementById('filtro_rede').value;

   filtro_turma =  document.getElementById('filtro_turma').value;

   filtro_tipo_usuario =  document.getElementById('filtro_tipo_usuario').value;


     $.post('/filtro_usuario', {escola:filtro_escola, rede:filtro_rede, turma:filtro_turma,tipo_usuario:filtro_tipo_usuario},function(data){
       $('#usuarios_sistema').html(data['usuario']);
       console.log(data);
       //usuarios = data['usuarios'];
       console.log("aqui,usuarios",data['usuarios'].values(data['usuarios']));
  });
  return false;
  }
</script>
%include('footer.tpl')