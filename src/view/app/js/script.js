function esqueci_senha(){
    email = document.getElementById('email')
    if(validar_se_email_existe(email)){
         window.location="/view_reformular_senha?email="+email.value;
    }
    else{
        document.getElementById('mensagem_erro').innerHTML='Email digitado não existe =('
    }
}

function filtro_usuario(){
   filtro_escola = document.getElementById('filtro_escola').value;
   filtro_rede = document.getElementById('filtro_rede').value;
   filtro_turma =  document.getElementById('filtro_turma').value;
   filtro_tipo_usuario =  document.getElementById('filtro_tipo_usuario').value;

   teste();

  $.post('/filtro_usuario', {escola:filtro_escola, rede:filtro_rede, turma:filtro_turma,tipo_usuario:filtro_tipo_usuario},function(data){
       console.log("log",data);
       $('#usuarios_sistema').html(data);


  });

  return false;
}
function teste(){
 $.post('/filtro_pesquisa', {escola:filtro_escola, rede:filtro_rede, turma:filtro_turma,tipo_usuario:filtro_tipo_usuario},function(data){
       console.log("log",data);
       $('#dropdown_filtros').html(data);
  });
}


function cadastro_observador(){
    tipo = document.getElementById('tipo');
    nome = document.getElementById('nome');
    senha = document.getElementById('senha');
    telefone =  document.getElementById('telefone');
    cpf = document.getElementById('cpf');
    email = document.getElementById('email');
    escola = document.getElementById('escola');
    rede = document.getElementById('rede');
    turma = document.getElementById('turma');

    if(!validar_campo_vazio(nome)){
        if(!validar_campo_vazio(senha)){
            if(!validar_campo_vazio(telefone)){
                if(!validar_campo_vazio(email)){
                    if(!validar_se_email_existe(email) && !validar_campo_vazio(cpf) && !validar_campo_vazio(rede) && !validar_campo_vazio(escola)){
                        $.post('/create_observador', {tipo:tipo.value,nome:nome.value,senha:senha.value,telefone:telefone.value,cpf:cpf.value,email:email.value,escola:escola.value,rede:rede.value,turma:turma.value},function(){
                        });
                        window.location="/gestao_aprendizagem/usuario";
                    }
                    else{
                        document.getElementById('erro_email').innerHTML = "Email já foi cadastrado";
                    }
                }
            }
        }
    }
}

function validar_campo_vazio(parametro){
    if(parametro.value == ''){
        document.getElementById(parametro.id).style.boxShadow = "0px 0px 12px #fe1313";
        return true;
    }
    else{
        document.getElementById(parametro.id).style.boxShadow = "0px 0px 0px #fe1313";
        return false;
    }
}

function emailValidador(){
    var email = document.getElementById("email");
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.value.match(mailformat)){
        document.getElementById("email").style.boxShadow = "0px 0px 12px #fe1313";
    }
    else{
        document.getElementById("email").style.boxShadow = "0px 0px 0px";
    }
}


function validar_se_email_existe(email){
    var retorno;
    $.ajax({
        url:    "/observador/email_existe",
        type:   "post",
        data:   {teste_email:email.value},
        async: false,

        success: function( data ){
            retorno = data;
        }
    });
    if(retorno == email.value){
        return true;
    }
    else{
        return false;
    }
}