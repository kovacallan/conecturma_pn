function filtro_usuario(){
    filtro_escola = document.getElementById('filtro_escola').value;
    filtro_rede = document.getElementById('filtro_rede').value;
    filtro_tipo_usuario =  document.getElementById('filtro_tipo_usuario').value;

   $.post('/usuario/filtro_usuario', {escola:filtro_escola, rede:filtro_rede, tipo_usuario:filtro_tipo_usuario},function(data){
        $('#usuarios_sistema').html(data);
   });
   return false;

}


