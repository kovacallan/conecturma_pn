<table class="table table-bordered" style="margin-top:0;">
    <thead style="background-color:#9ed0f6;">
      <tr style="color:#fff;">
        <th scope="col">Descritor</th>
        <th scope="col">Desempenho</th>
        <th scope="col" style="padding-right:0px;"></th>
      </tr>
    </thead>

    <tbody style="background-color:#f3f3f3;">
        %teste = 0
        %for i in oa:
            % if teste < len(porcentagem):
            <tr>
                <td>{{i['descricao_descritor']}}</td>
                  <td>
                    %if int(porcentagem[teste]) >= 70:
                        <img src="/static/img/feed-pos.png" style="display: block; margin-left: auto; margin-right: auto">
                    %elif int(porcentagem[teste]) >= 50 and int(porcentagem[teste]) <= 69:
                        <img src="/static/img/feed-med.png" style="display: block; margin-left: auto; margin-right: auto">
                    %elif int(porcentagem[teste]) >= 0 and int(porcentagem[teste]) <= 49:
                        <img src="/static/img/feed-neg.png" style="display: block; margin-left: auto; margin-right: auto">
                    %end
                </td>
                <td data-toggle="collapse" data-target=".grafico{{i['id']}}" class="accordion-toggle" onclick="funcoes('grafico{{i['id']}}',{{pontos[teste]}})">
                    <!--<i id="setinha_grafico{{i['id']}}_down" onclick="funcoes('grafico{{i['id']}}', {{pontos[teste]}})" class="fas fa-angle-down"></i>
                    <i id="setinha_grafico{{i['id']}}_up" onclick="funcoes('grafico{{i['id']}}', {{pontos[teste]}})" class="fas fa-angle-up" style="display:none;"></i>-->
                </td>
            </tr>
            <tr>
                <td  class="hiddenRow" colspan="3"> <div class="accordian-body collapse grafico{{i['id']}}">
                <canvas id="myChart_grafico{{i['id']}}"></canvas> </div> </td>
            </tr>
          % else:
                <tr>
                <td>{{i['descricao_descritor']}}</td>
              <td>

              </td>
              <td data-toggle="collapse" data-target=".grafico{{i['id']}}" class="accordion-toggle" onclick="funcoes('grafico{{i['id']}}')">

                </td>
          % end
        </tr>
         %teste+=1
        % end
    </tbody>
</table>