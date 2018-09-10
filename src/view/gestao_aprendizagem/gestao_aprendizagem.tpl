%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-gestao-aprendizagem.css")
%include('gestao_aprendizagem/menu/menu.tpl')
<div class="col-md-9 order-md-3 texto-inicial" style="margin-top: 70px;">
    <div style="margin-left: 41px;">
        <div class="row">
<div class="col-md-3" id='inter' style="border-radius: 113px;position:relative;z-index:5;">
                <form method="POST" enctype="multipart/form-data" action="http://localhost:8080/upload_img">
                        <div class="col-md-12 doughnut" style="height: 165px;position:relative;transform:translate(9px, -18px);left: 22px;" ><!--onclick="getElementById(&#39;image&#39;).style.zIndex=&#39;1&#39;"-->
                            <div id="image" class="" style="position: relative; z-index: 1; {{css_foto}} ;margin-left: -50px;">
                                <!--<div>-->
                                <img src="/static/fotos_usuarios/{{foto_obs}}" class="profile-image blah img-responsive img-circle" style="margin-top: 25px;" >

                                <!--</div>-->
                            </div>
                        </div>

                    <div class="row" style="margin-top:5px;margin-left:25px;">
                        <i class="fas fa-question-circle" data-toggle="tooltip" data-placement="left" title="por favor coloque uma imagem de ate 1MB , em formato jpeg , png ou jpg"></i><label for="img-obs" class="efeito-img botao-salvar" style="font-size: 10pt;padding: 6px;margin-left: 10px;border-radius: 100px;">Mudar Imagem
                            Perfil</label>
                        <input type="file" id="img-obs" name="uploadfile" onchange="readURL(this);" style="display:none"><br>
                        <input type="submit" value="Salvar" class="botao-salvar" id="salv" style="display:none;margin-left: 49px;">
                    </div>
                </form>
            </div>

            <div class="col-md-9" style="padding-left: 60px;">
                <div class="row fonte-texto" style="margin-top:18px;">
                    <h3 class="Ola">Olá <strong>{{usuario}}</strong></h3>
                    <p>
                        Bem-vindo ao ambiente de gestão de aprendizagem. Aqui você<br> poderá acompanhar o desempenho
                        dos seu aluno ou da sua turma<br> de uma maneira fácil e intuitiva.
                    </p>
                </div>
            </div>

        </div>


    </div>
    <div class="row tutorial-block">
        <div class="col-md-3" style="margin-left: 40px; margin-right: 70px;">
            <div class="relatorios-img" style="margin-left: 37px;">
                <img src="/static/img/relatorios.png">
            </div>
            <br/>
            <br/>
            <p class="fonte-texto" style="font-size: 15.45px;">Em <a href="#" class="relatorios-tut-font"><strong>relatórios</strong></a>,
                com poucos cliques você terá acesso ao desempenho do aluno, de toda a turma e também da escola.</p>
        </div>
        <div class="col-md-3 tutorial-gerenciamento">
            <div style="margin-left: 37px;">
                <img class="img-cadastros" src="/static/img/cadastros.png">
            </div>
            <br/><br/>

            <p class="fonte-texto" style="font-size: 15.45px;">Para criar novos cadastros, editar os já existentes,
                excluir ou modificar informações variadas de alunos, turmas e escolas, clique em <a href="#"
                                                                                                    class="gerenciam-tut-font"><strong>
                    Gerenciamento de Cadastros</strong></a></p>
        </div>
        <div class="col-md-3">
            <div class="img-recursos_pedagogicos" style="margin-left: 37px;">
                <img src="/static/img/recursos_pedagogicos.png">
            </div>
            <br/><br/>
            <p class="fonte-texto" style="font-size: 15.45px;">Você ainda pode ter<br> acesso a diversos<br> material
                exclusivos da Conecturma na área <a href="#" class="recursos-tut-font"><strong> Recursos
                    Pedagógicos</strong></a>, <br> tais como guias, manuais, infográficos e versões diditais de livros.
            </p>
        </div>
    </div>


</div>

<script src="../static/js/interact.min.js"></script>
<script type="text/javascript" src="../static/js/jquery-3.3.1-min.js"></script>
<script>
function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                ext=input.files[0].name.split('.')[1];
                console.log(ext,input.files[0].size,input.files);
                if (ext != 'png' && ext!= 'jpg' && ext!= 'jpeg'){
                        alert('POOOOO , coloca um png ou jpg ou jpeg ae');
                }else if (input.files[0].size > 1048576){
                        alert('por favor selecione uma imagem ate 1MB');
                        }
                else{
                        //getElementById('image').style.zIndex='1';
                    $('#salv').css('display','block');
                  var element = document.getElementById("image");
                    element.classList.add("draggable");
                    reader.onload = function (e) {
                        $('.blah')
                            .attr('src', e.target.result)
                    };
        }

                reader.readAsDataURL(input.files[0]);
            }
            }




</script>
<script>
interact('.draggable').draggable({
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
    }
  });

  function dragMoveListener (event) {
    console.log('test',event.target);
    var target = event.target,

        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';



    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    $.ajax({
     url: '/salvar_css_foto',
     data: {
        posicao_foto:'transform:translate(' + x + 'px, ' + y + 'px)'
    },
    dataType: 'json',
    type: 'post'
});
  }



</script>
<!--<div class="resize-container" style="background-color: #29e;-->
<!--color: white;-->
<!--font-size: 20px;-->
<!--font-family: sans-serif;-->
<!--border-radius: 8px;-->
<!--padding: 20px;-->
<!--margin: 30px 20px;-->
<!--width: 500px;-->
<!--height:500px;-->
<!--box-sizing: border-box;">-->
<!--<div class="resize-drag draggable" style=" display: inline-block;-->
<!--width: 100px;-->
<!--height: 140px;-->
<!--background-color:black;">-->
<!--Resize from any edge or corner-->
<!--</div>-->
<!--</div>-->



%include('gestao_aprendizagem/footer/footer.tpl')