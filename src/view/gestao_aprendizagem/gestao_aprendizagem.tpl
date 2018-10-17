%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-gestao-aprendizagem.css")
%include('gestao_aprendizagem/menu/menu.tpl')
<div class="col-md-9 order-md-3 texto-inicial" style="margin-top: 15px;">
    <div style="margin-left: 41px;">
        <div class="row">
<div class="col-md-3" id='inter' style="border-radius: 113px;position:relative;z-index:5;">

  <div class="col-md-12" style="height: 165px;position:relative;transform:translate(9px, -18px);left: 22px;" >
      <div id="image" style="position: relative; z-index: 1; {{css_foto}} ;margin-left: -50px;">
          <label for="img-obs">
              <img src="/static/fotos_usuarios/{{foto_obs}}" class="img-thumbnail rounded-circle" data-toggle="modal" data-target="#exampleModal" style="width: 150px; height: 150px;margin-top: 25px;" >
              <!--<div class="doughnut"></div>-->
          </label>
      </div>
  </div>


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

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content modal-lg" style="width: 769px; right: 105px; height: 469px;">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Atualizar foto de perfil</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <style type="text/css">
          .cropperContainer {
            float: left;
            border: 0px solid #eee;
            min-width: 440px;/*Used to improve layout during loading the image.*/
            min-height: 300px;
          }
          .previews {
            float: left;
            margin-left: 0px;
          }
          .previewSmall {
            margin: 40px;
            width: 60px;
            height: 60px;
          }
          .icropper img {
            width:450px;
            height: 300px;
          }

          .info {
            clear: both;
            padding: 5px;
            font-family: Arial;
            font-size: 12px;
            color: #777;
          }
      </style>
      <div class="modal-body">
          <form id="image_form" method="POST" enctype="multipart/form-data" action="/upload_img">
              <input type="file" id="img-obs" onchange="readURL(this)" name="uploadfile" style="display:none;">

              <input type="hidden" id="left" name="left" class="info">
              <input type="hidden" id="top" name="top" class="info">
              <input type="hidden" id="width" name="width" class="info">
              <input type="hidden" id="height" name="height" class="info">
              <input type="hidden" id="imgheight" name="imgheight" class="info">
          </form>
        <div id="demo1" class="demoWrapper">
          <div id="cropperContainer1" class="cropperContainer" ></div>
          <div class="previews">
              <div id="previewSmall1" class="previewSmall rounded-circle" style="width: 150px; height: 150px;"></div>
          </div>
          </div>
      </div>
      <div class="modal-footer">
        <button type="button" onclick="crop_image_save()" class="btn btn-primary">Salvar</button>
      </div>
    </div>
  </div>
</div>

%include('gestao_aprendizagem/footer/footer.tpl')
<script src="../static/js/icropper.js"></script>
<script>
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        ext=input.files[0].name.split('.')[1];
        console.log(ext,input.files[0].size,input.files);
        if (ext != 'png' && ext!= 'jpg' && ext!= 'jpeg'){
            alert('A imagem precisa ser um png ou jpg');
        }else if (input.files[0].size > 1048576){
            alert('por favor selecione uma imagem ate 1MB');
        }
        else{
          reader.onload = function (e){
            var infoLeft = document.getElementById('left');
            var infoTop = document.getElementById('top');
            var infoWidth = document.getElementById('width');
            var infoHeight = document.getElementById('height');
            document.getElementById('height');
            var ic1 = new ICropper(
              'cropperContainer1'
              ,{
                  ratio: 1
                  ,image: e.target.result
                  ,onChange: function(info){	//onChange must be set when constructing.
                    infoLeft.value = info.l;
                    infoTop.value = info.t;
                    infoWidth.value = info.w;
                    infoHeight.value = info.h;

                  }
                  ,preview: [
                      'previewSmall1'
                  ]
            });
          };
            //document.getElementById("image_form").submit();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function crop_image_save(){
  document.getElementById("image_form").submit()
}

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
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    //update the posiion attributes
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
