%include('gestao_aprendizagem/header/header.tpl', title="Gestão Aprendizagem", css="css-gestao-aprendizagem.css")
<div align="" class="col-md">
    <h1 id="h1-admin">Bem Vindo à Conecturma, Administrador</h1>
</div>
<div class="row">

%include('gestao_aprendizagem/menu/menu.tpl')

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
    <div class="col-md-5 order-md-2" style="margin-top:50px;">
       <table class="table table-bordered" style="margin-top:0;">
          <thead style="background-color:#9ed0f6;">
            <tr style="color:#fff;">
                <th scope="col">Usuário</th>
                <th scope="col">Ação</th>
                <th scope="col">Data/Hora</th>
            </thead>
           <tbody style="background-color:#f3f3f3;">
            %for i in usuario:

            <tr scope="row">

                <!--<td style="border: 1px solid #dddddd">{{i['id']}}</td>-->
                <td style="border: 1px solid #dddddd" >{{i['nome_usuario']}}</td>
                <td style="border: 1px solid #dddddd">{{i['acao']}}</td>
                <td style="border: 1px solid #dddddd">{{i['momento'].strftime("%d-%m-%Y %H:%M:%S")}}</td>
            </tr>

            %end
           </tbody>
        </table>


    </div>
</div>

%include('gestao_aprendizagem/footer/footer.tpl')