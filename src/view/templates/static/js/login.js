var letras_senha = {'a':false, 'b':false, 'c':false, 'd':false, 'e':false, 'f':false, 'g':false, 'h':false, 'i':false, 'j':false, 'k':false, 'l':false};

function mudaEstado(letra){
 	var imagem = document.getElementById(letra);
 	var num = 3;
 	var selecionada = false;
 	if (!letras_senha[letra]){
 		imagem.style.background= 'rgba(229, 255, 84, 0.5)';
 		letras_senha[letra] = letra
 	}else{
 		imagem.style.background = ' rgba(113, 194, 117, 0.5)';
 		letras_senha[letra] = false
 	}
}

function mouseIn(letra){
 	var imagem = document.getElementById(letra);
  if (!letras_senha[letra]){
 	  imagem.style.background= 'rgba(229, 255, 84, 0.5)';
  }
}

function mouseOut(letra){
 	var imagem = document.getElementById(letra);
  if (!letras_senha[letra]){
 	  imagem.style.background= 'rgba(113, 194, 117, 0.5)';
  }
}
function login_aluno(){
  nome = document.getElementById('login_aluno_input').value.toUpperCase();
  senha = [];

  for (var i in letras_senha){
    if (letras_senha[i]){
      senha.push(letras_senha[i]);
    }
  }
  senha = senha.join('')
  $.post('/login/login_aluno', {aluno_login_nome:nome, aluno_senha:senha},function(data){
      if(data == "error"){
        document.getElementById("text-erro").innerHTML = "Ops! Você não escolheu as figurinhas corretas! Tente mais uma vez!";
        document.getElementById("divRecuperarSenha").style.display="block";
      }
      else{
      window.location.replace(data);
      }
  });
}


function login_professor(){
  email = document.getElementById('inputEmail').value;
  senha = document.getElementById('inputPassword').value;
  if (email != '' && senha !=''){
    $.post('/login/login_observador', {observador_login_email:email, observador_senha:senha},function(data){
        if(data == "error"){
        document.getElementById("text-erro").innerHTML = "Email ou senha incorretos. Tente novamente ou contate o seu administrador.";
        document.getElementById("divRecuperarSenha").style.display="block";
      }
      else{
      window.location.replace(data);
      }
    });
  }

}