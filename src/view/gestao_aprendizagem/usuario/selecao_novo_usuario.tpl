
%if tipo== '0':
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="1">
Gestor
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="2">
Diretor
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="3">
Professor
<!--<input type="radio" aria-label="Radio button for following text input">
Gestor-->
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="4">
Aluno

%elif tipo =='1':
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="2">
Diretor
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="3">
Professor
<!--<input type="radio" aria-label="Radio button for following text input">
Gestor-->
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="4">
Aluno

%elif tipo=='2':
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="3">
Professor
<!--<input type="radio" aria-label="Radio button for following text input">
Gestor-->
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="4">
Aluno

%elif tipo =='3':
<input name="tipo_usuario" type="radio" aria-label="Radio button for following text input" value="4">
Aluno

%end

<button type="button" class="botao-nova-escola" id="new_user">
  <i class="fas fa-plus"></i>
  &nbsp;Novo Usuário
</button>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script>
$("#new_user").on("click",function(){

    var radioValue = $("input[name='tipo_usuario']:checked").val();
     alert(radioValue);
    $("#" + radioValue).css("display","block");

});
</script>
