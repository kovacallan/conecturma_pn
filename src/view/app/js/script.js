$("#new_user").on("click",function(){
    var radioValue = $("input[name='tipo_usuario']:checked").val();
    $("#" + radioValue).css("display","block");

    gestor = document.getElementById('1').style.display;
    diretor = document.getElementById('2').style.display;
    professor = document.getElementById('3').style.display;
    aluno = document.getElementById('4').style.display;
    if (radioValue =='1'){
    diretor = document.getElementById('2').style.display='none';
    professor = document.getElementById('3').style.display='none';
    aluno = document.getElementById('4').style.display='none';
    }
    else if(radioValue =='2') {
    gestor = document.getElementById('1').style.display='none';
    professor = document.getElementById('3').style.display='none';
    aluno = document.getElementById('4').style.display='none';
    }
    else if(radioValue =='3'){
    gestor = document.getElementById('1').style.display='none';
    diretor = document.getElementById('2').style.display='none';
    aluno = document.getElementById('4').style.display='none';
    }
    else if(radioValue =='4'){
    gestor = document.getElementById('1').style.display='none';
    diretor = document.getElementById('2').style.display='none';
    professor = document.getElementById('3').style.display='none';
    }
    console.log('teste',gestor,diretor,professor,aluno,radioValue);
});

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

function emailValidador(id){
    var email = document.getElementById(id);
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.value.match(mailformat)){
        document.getElementById(id).style.boxShadow = "0px 0px 12px #fe1313";
        return false
    }
    else{
        document.getElementById(id).style.boxShadow = "0px 0px 0px";
        return true
    }
}


function validar_se_email_existe(email){
    var retorno;
    $.ajax({
        url:    "/observador/email_existe",
        type:   "post",
        data:   {teste_email:email},
        async: false,

        success: function( data ){
            retorno = data;
        }
    });
    if(retorno == email){
        return true;
    }
    else{
        return false;
    }
}

var letras_senha = {'a':false, 'b':false, 'c':false, 'd':false, 'e':false, 'f':false, 'g':false, 'h':false, 'i':false, 'k':false, 'l':false};

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

function mouse_in(letra){
 	var imagem = document.getElementById(letra);
  if (!letras_senha[letra]){
 	  imagem.style.background= 'rgba(229, 255, 84, 0.5)';
  }
}

function mouse_out(letra){
 	var imagem = document.getElementById(letra);
  if (!letras_senha[letra]){
 	  imagem.style.background= 'rgba(113, 194, 117, 0.5)';
  }
}

function login_aluno(){
  nome = document.getElementById('Login').value;
  senha = [];
  for (var i in letras_senha){
    if (letras_senha[i]){
      senha.push(letras_senha[i]);
    }
  }
  senha = senha.join('')
  $.post('/login/login_aluno', {aluno_login_nome:nome, aluno_senha:senha},function(data){
      console.log(data);
     window.location.replace(data);
  });
}

function login_professor(){
  email = document.getElementById('inputEmail').value;
  senha = document.getElementById('inputPassword').value;
  if (email != '' && senha !=''){
    $.post('/login/login_observador', {observador_login_email:email, observador_senha:senha},function(data){
        console.log(data);
       window.location.replace(data);
    });
  }
}

function filtro_relatorio_aluno_detalhe(teste){
    portugues = document.getElementById('portugues');
    matematica = document.getElementById('matematica');
    if (!portugues.checked){
        diciplina = '2'
    }
    else if (!matematica.checked){
        diciplina = '1'
    }
    else{
        diciplina = '0'
    }

    $.get('/trazer_oas', {aluno:teste, diciplina:diciplina},function(data){
        $('#teste').html(data);
   });

}

function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}

var telMask = ['(99) 9999-99999', '(99) 99999-9999'];
var tel = document.querySelector('#telefone');
Masker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);

function cadastro_escola(){
    nome = document.getElementById('nome').value;
    cnpj = document.getElementById('cnpj').value;
    telefone = document.getElementById('telefone').value;
    diretor = document.getElementById('diretor').value;
    rede = document.getElementById('rede').value;
    endereco = document.getElementById('endereco').value;
    numero = document.getElementById('numero').value;
    bairro = document.getElementById('bairro').value;
    complemento = document.getElementById('complemento').value;
    cep = document.getElementById('cep').value;
    estado = document.getElementById('estado').value;
    municipio = document.getElementById('municipio').value;

    if (nome != '' && nome != null){
        if (telefone != '' && telefone != null && telefone.length >= 10){
            $.post('/escola/criar_escola', {nome:nome, cnpj:cnpj, telefone:telefone, diretor:diretor, rede:rede,
            endereco:endereco, numero:numero, bairro:bairro, complemento:complemento, cep:cep, estado:estado, municipio:municipio},function(data){
            });
            setTimeout(location.reload(), 3000);
        }
        else{
            alert('O campo telefone é obrigatório.');
            document.getElementById("telefone").style.boxShadow = "0px 0px 12px #fe1313";
        }
    }else{
        alert('O campo nome é obrigatório.');
        document.getElementById("nome").style.boxShadow = "0px 0px 12px #fe1313";
    }
}

function update_escola(id){
    id = document.getElementById('id_escola'+id).value;
    nome = document.getElementById('nome'+id).value;
    cnpj = document.getElementById('cnpj'+id).value;
    telefone = document.getElementById('telefone'+id).value;
    rede = document.getElementById('rede'+id).value;
    endereco = document.getElementById('endereco'+id).value;
    numero = document.getElementById('numero'+id).value;
    bairro = document.getElementById('bairro'+id).value;
    complemento = document.getElementById('complemento'+id).value;
    cep = document.getElementById('cep'+id).value;
    estado = document.getElementById('estado'+id).value;
    municipio = document.getElementById('municipio'+id).value;


    if (nome != '' && nome != null){
        if (telefone != '' && telefone != null && telefone.length >= 10){
            $.post('/escola/editar_escola', {id:id, nome:nome, cnpj:cnpj, telefone:telefone, vinculo_rede:rede,
            endereco:endereco, numero:numero, bairro:bairro, complemento:complemento, cep:cep, estado:estado, municipio:municipio},function(data){
            });
            location.reload();
        }
        else{
            alert('O campo telefone é obrigatório.');
            document.getElementById("telefone").style.boxShadow = "0px 0px 12px #fe1313";
        }
    }else{
        alert('O campo nome é obrigatório.');
        document.getElementById("nome").style.boxShadow = "0px 0px 12px #fe1313";
    }
}

function delete_estrutura(id){
    if(window.confirm("Tem certeza que deseja apagar essa escola ?")){
        $.post('/deletar_estrutura', {id:id},function(data){
        });
        location.reload();
    }
}

function cadastro_rede(){
    nome = document.getElementById('nome').value;
    cnpj = document.getElementById('cnpj').value;
    telefone = document.getElementById('telefone').value;
    endereco = document.getElementById('endereco').value;
    numero = document.getElementById('numero').value;
    bairro = document.getElementById('bairro').value;
    complemento = document.getElementById('complemento').value;
    cep = document.getElementById('cep').value;
    estado = document.getElementById('estado').value;
    municipio = document.getElementById('municipio').value;

    if (nome != '' && nome != null){
        if (telefone != '' && telefone != null && telefone.length >= 10){
            $.post('/rede/criar_rede', {nome:nome, cnpj:cnpj, telefone:telefone,
            endereco:endereco, numero:numero, bairro:bairro, complemento:complemento, cep:cep, estado:estado, municipio:municipio},function(data){
            });
            location.reload();
        }
        else{
            alert('O campo telefone é obrigatório.');
            document.getElementById("telefone").style.boxShadow = "0px 0px 12px #fe1313";
        }
    }else{
        alert('O campo nome é obrigatório.');
        document.getElementById("nome").style.boxShadow = "0px 0px 12px #fe1313";
    }
}

function update_rede(id){
    id = document.getElementById('id_escola'+id).value;
    nome = document.getElementById('nome'+id).value;
    cnpj = document.getElementById('cnpj'+id).value;
    telefone = document.getElementById('telefone'+id).value;
    endereco = document.getElementById('endereco'+id).value;
    numero = document.getElementById('numero'+id).value;
    bairro = document.getElementById('bairro'+id).value;
    complemento = document.getElementById('complemento'+id).value;
    cep = document.getElementById('cep'+id).value;
    estado = document.getElementById('estado'+id).value;
    municipio = document.getElementById('municipio'+id).value;


    if (nome != '' && nome != null){
        if (telefone != '' && telefone != null && telefone.length >= 10){
            $.post('/rede/editar_rede', {id:id, nome:nome, cnpj:cnpj, telefone:telefone,
            endereco:endereco, numero:numero, bairro:bairro, complemento:complemento, cep:cep, estado:estado, municipio:municipio},function(data){
            });
            location.reload();
        }
        else{
            alert('O campo telefone é obrigatório.');
            document.getElementById("telefone").style.boxShadow = "0px 0px 12px #fe1313";
        }
    }else{
        alert('O campo nome é obrigatório.');
        document.getElementById("nome").style.boxShadow = "0px 0px 12px #fe1313";
    }
}


function cadastro_turma(){
    nome = document.getElementById('nome').value;
    serie = document.getElementById('serie').value;
    escola = document.getElementById('escola').value;

    if (nome != '' && nome != null){
        if (serie!= '' && serie != null){
            if (escola!= '' && escola != null){
                $.post('/turma/cadastro_turma', {nome:nome, serie:serie, escola:escola},function(data){
                });
                location.reload();
            }
            else{
                alert('O campo escola é obrigatório.');
            document.getElementById("telefone").style.boxShadow = "0px 0px 12px #fe1313";
            }

        }
        else{
            alert('O campo série é obrigatório.');
            document.getElementById("telefone").style.boxShadow = "0px 0px 12px #fe1313";
        }
    }else{
        alert('O campo nome é obrigatório.');
        document.getElementById("nome").style.boxShadow = "0px 0px 12px #fe1313";
    }
}



function cadastro_usuario(tipo){
    if (tipo == 'aluno'){
        nome = document.getElementById(tipo+'_nome').value;
        nascimento = document.getElementById(tipo+'_nascimento').value;
        sexo = document.getElementById(tipo+'_sexo').value;
        escola = document.getElementById(tipo+'_escola').value;
        turma = document.getElementById(tipo+'_turma').value;

        if (nome != '' && nome != null){
            if (nascimento != '' && nascimento != null){
                if (escola != '' && escola != null){
                    $.post('/usuario/cadastro_usuario', {tipo:tipo, nome:nome, nascimento:nascimento, sexo:sexo, vinculo_escola:escola, vinculo_turma:turma},function(data){
                    });
                    window.location.reload(true)
                }
                else{
                    alert('O campo escola é obrigatório.');
                    document.getElementById(tipo+'_escola').style.boxShadow = "0px 0px 12px #fe1313";
                }
            }
            else{
                alert('O campo nascimento é obrigatório.');
                document.getElementById(tipo+'_nascimento').style.boxShadow = "0px 0px 12px #fe1313";
            }
        }
        else{
            alert('O campo nome é obrigatório.');
            document.getElementById(tipo+'_nome').style.boxShadow = "0px 0px 12px #fe1313";
        }

    }
    else if(tipo == 'professor'){
        nome = document.getElementById(tipo+'_nome').value;
        nascimento = document.getElementById(tipo+'_nascimento').value;
        email = document.getElementById(tipo+'_email').value;
        escola = document.getElementById(tipo+'_escola').value;
        turma = document.getElementById(tipo+'_turma').value;

        if (nome != '' && nome != null){
            if (nascimento != '' && nascimento != null){
                if (email != '' && email != null && emailValidador(tipo+'_email')){
                    if(!validar_se_email_existe(email)){
                        if (escola != '' && escola != null){
                            $.post('/usuario/cadastro_usuario', {tipo:tipo, nome:nome, nascimento:nascimento, email:email, vinculo_escola:escola, vinculo_turma:turma},function(data){
                            });
                        }
                        else{
                            alert('O campo escola é obrigatório.');
                            document.getElementById(tipo+'_escola').style.boxShadow = "0px 0px 12px #fe1313";
                        }

                    }
                    else{
                        alert('O email digitado já foi cadastrado no nosso sitema.');
                        document.getElementById(tipo+'_email').style.boxShadow = "0px 0px 12px #fe1313";
                    }
                }
                else{
                    alert('O campo email é obrigatório.');
                    document.getElementById(tipo+'_email').style.boxShadow = "0px 0px 12px #fe1313";
                }
            }
            else{
                alert('O campo nascimento é obrigatório.');
                document.getElementById(tipo+'_nascimento').style.boxShadow = "0px 0px 12px #fe1313";
            }
        }
        else{
            alert('O campo nome é obrigatório.');
            document.getElementById(tipo+'_nome').style.boxShadow = "0px 0px 12px #fe1313";
        }
    }
    else if(tipo == 'diretor'){
        alert('entrei aqui')
        nome = document.getElementById(tipo+'_nome').value;
        nascimento = document.getElementById(tipo+'_nascimento').value;
        email = document.getElementById(tipo+'_email').value;
        escola = document.getElementById(tipo+'_escola').value;
        if (nome != '' && nome != null){
            if (nascimento != '' && nascimento != null){
                if (email != '' && email != null && emailValidador(tipo+'_email')){
                    if(!validar_se_email_existe(email)){
                        if (escola != '' && escola != null){
                            $.post('/usuario/cadastro_usuario', {tipo:tipo, nome:nome, nascimento:nascimento, email:email, vinculo_escola:escola},function(data){
                            });
                            location.reload();
                        }
                        else{
                            alert('O campo escola é obrigatório.');
                            document.getElementById(tipo+'_escola').style.boxShadow = "0px 0px 12px #fe1313";
                        }

                    }
                    else{
                        alert('O email digitado já foi cadastrado no nosso sitema.');
                        document.getElementById(tipo+'_email').style.boxShadow = "0px 0px 12px #fe1313";
                    }
                }
                else{
                    alert('O campo email é obrigatório.');
                    document.getElementById(tipo+'_email').style.boxShadow = "0px 0px 12px #fe1313";
                }
            }
            else{
                alert('O campo nascimento é obrigatório.');
                document.getElementById(tipo+'_nascimento').style.boxShadow = "0px 0px 12px #fe1313";
            }
        }
        else{
            alert('O campo nome é obrigatório.');
            document.getElementById(tipo+'_nome').style.boxShadow = "0px 0px 12px #fe1313";
        }
    }
    else if(tipo == 'gestor'){
        nome = document.getElementById(tipo+'_nome').value;
        nascimento = document.getElementById(tipo+'_nascimento').value;
        email = document.getElementById(tipo+'_email').value;
        rede = document.getElementById(tipo+'_rede').value;

        if (nome != '' && nome != null){
            if (nascimento != '' && nascimento != null){
                if (email != '' && email != null && emailValidador(tipo+'_email')){
                    if(!validar_se_email_existe(email)){
                        if (rede != '' && rede != null){
                            $.post('/usuario/cadastro_usuario', {tipo:tipo, nome:nome, nascimento:nascimento, email:email, vinculo_rede:rede},function(data){
                            });
                            setTimeout(location.reload(), 5000);
                        }
                        else{
                            alert('O campo rede é obrigatório.');
                            document.getElementById(tipo+'_rede').style.boxShadow = "0px 0px 12px #fe1313";
                        }
                    }
                    else{
                       alert('O email digitado já foi cadastrado no nosso sitema.');
                        document.getElementById(tipo+'_email').style.boxShadow = "0px 0px 12px #fe1313";
                    }

                }
                else{
                    alert('O campo email é obrigatório.');
                    document.getElementById(tipo+'_email').style.boxShadow = "0px 0px 12px #fe1313";
                }
            }
            else{
                alert('O campo nascimento é obrigatório.');
                document.getElementById(tipo+'_nascimento').style.boxShadow = "0px 0px 12px #fe1313";
            }
        }
        else{
            alert('O campo nome é obrigatório.');
            document.getElementById(tipo+'_nome').style.boxShadow = "0px 0px 12px #fe1313";
        }
    }
}
