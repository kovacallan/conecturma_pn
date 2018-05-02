function filtro_usuario(){
    filtro_escola = document.getElementById('filtro_escola').value;
    filtro_rede = document.getElementById('filtro_rede').value;
    filtro_tipo_usuario =  document.getElementById('filtro_tipo_usuario').value;

   $.post('/usuario/filtro_usuario', {escola:filtro_escola, rede:filtro_rede, tipo_usuario:filtro_tipo_usuario},function(data){
        $('#usuarios_sistema').html(data);
   });
   return false;

}

function cadastro_observador(){
    nome = document.getElementById('nome');
    senha = document.getElementById('senha');
    telefone =  document.getElementById('telefone');
    email = document.getElementById('email');
    escola = document.getElementById('escola');

    if(!validar_campo_vazio(nome)){
        
        if(!validar_campo_vazio(senha)){
        
            if(!validar_campo_vazio(telefone)){
        
                if(!validar_campo_vazio(email)){
                    alert('entrei aqui')
                    validar_se_email_existe(email)
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
    $.post('/observador/email_existe', {teste_email:email.value},function(data){
        console.log(data)
   });
    return false;
}