%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-gestao-aprendizagem.css")
<div align="" class="col-md">
    <h1 id="h1-admin">Bem Vindo à Conecturma, Administrador</h1>
</div>
<div class="row">
     <div class="col-md-2.5 order-md-1" style="margin-top: 15px;width: 196px;margin-left: 45px;">

        <div class="list-group-item  gerenc-cadastro">
            <div class="row">
                <img src="/static/img/cadastros_ico.png" class="cadastros-ico">
                <div style="margin-left: 16px;" class="row">
                    Gerenciamento de<br>Cadastro
                </div>

            </div>

        </div>
        <div align="left">
            <a href="/rede" class="list-group-item li-background  justify-content-between li-background lh-condensed" ><span style="margin-left: 54px;">Rede</span></a>
            <a href="/escola" class="list-group-item li-background  justify-content-between li-background lh-condensed"><span style="margin-left: 54px;">Escola</span></a>
            <a href="/turma" class="list-group-item li-background  justify-content-between li-background lh-condensed"><span style="margin-left: 54px;">Turma</span></a>
            <a href="/gestao_aprendizagem/usuario" class="list-group-item li-background  justify-content-between li-background lh-condensed"><span style="margin-left: 54px;">Usuário</span></a>
        </div>

        <!--<a class="list-group-item recursos-ped recursos-ped-background" href="/recurso"> <img src="/static/img/recursos_ico.png" class="mr-2 recursos-ico"> Recursos pedagogicos</a>-->
</div>


    <!--<div class="col-md-2" style="margin-top:50px;">-->
        <!--<p>Gerenciamento de <br>Cadastros</p>-->
        <!--<a href="/rede">REDE</a><br>-->
        <!--<a href="/escola">ESCOLA</a><br>-->
        <!--<a href="/turma">TURMA</a><br>-->
        <!--<a href="/gestao_aprendizagem/usuario">USUÁRIOS</a><br>-->
        <!--&lt;!&ndash;<a href="/cadastro_descritor_view">DESCRITOR</a><br>-->
        <!--<a href="/loja/cadastrar_item">ITENS DE AVATAR</a><br>-->
        <!--<a href="/ler_medalha">MEDALHAS</a><br>-->
        <!--<a href="/usuarios_inativados">INATIVADOS</a>&ndash;&gt;-->
    <!--</div>-->
    <div  class="col-md-8 order-md-2" style="margin-top:50px;margin-left: 59px;">
         <div class="container" style="margin-top:35px">
        <div class="form-group">
            <select name="state" id="maxRows" class="form-control" style="width:150px;">
                <option value="5000">Tudo</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
            </select>
        </div>
       <table id="mytable" class="table table-bordered paginated" style="margin-top:0;">
          <thead style="background-color:#9ed0f6;margin-left: 27px;">
            <tr style="color:#fff;">
                <th scope="col">Usuário</th>
                <th scope="col">Ação</th>
                <th scope="col">Data/Hora</th>
            </thead>
           %Cont = 2
            <div id="page-selection"></div>
           <tbody id="content" style="">
           %for i in usuario:

           %if Cont%2 == 0:
                <tr scope="row" style=" background-color:#f3f3f3;">

                    <!--<td style="border: 1px solid #dddddd">{{i['id']}}</td>-->
                    <td style="border: 1px solid #dddddd" >{{i['nome_usuario']}}</td>
                    <td style="border: 1px solid #dddddd">{{i['acao']}}</td>
                    <td style="border: 1px solid #dddddd">{{i['momento'].strftime("%d-%m-%Y %H:%M:%S")}}</td>
                </tr>
                %Cont = Cont + 1

           %else:

               <tr scope="row" style=" background-color:#dedede;">

                    <!--<td style="border: 1px solid #dddddd">{{i['id']}}</td>-->
                    <td id="nome_user" style="border: 1px solid #dddddd" >{{i['nome_usuario']}}</td>
                    <td id="acao" style="border: 1px solid #dddddd">{{i['acao']}}</td>
                    <td id="momento" style="border: 1px solid #dddddd">{{i['momento'].strftime("%d-%m-%Y %H:%M:%S")}}</td>
                </tr>
                %Cont = Cont - 1
           %end
           %end
           %end
           </tbody>
       </table>
        <nav class="pagination-container"  aria-label="Page navigation example">
                  <ul class="pagination">

                  </ul>
        </nav>

        <!--<div class="pagination-container">-->
            <!--<nav>-->
                <!--<ul class="pagination"></ul>-->
            <!--</nav>-->
        <!--</div>-->

    </div>
</div>

%include('gestao_aprendizagem/footer/footer.tpl')