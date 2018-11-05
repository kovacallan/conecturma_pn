<table class="table table-bordered" style="margin-top:0;">
   <thead style="background-color:#9ed0f6;">
      <tr style="color:#fff;">


        <th scope="col" >Descritor</th>
        <th scope="col">Desempenho</th>
      </tr>
    </thead>

    <tbody style="background-color:#f3f3f3;">
        %teste = 0
        %for i in oa:
            % if teste < len(porcentagem):
            <tr style="cursor: pointer;"  data-toggle="collapse"  class="ex" onclick="funcoes('grafico{{i['id']}}',{{pontos[teste]}}); esconder('grafico{{i['id']}}')">

                <td>{{i['descricao_descritor']}}</td>
                  <td>
                    %if int(porcentagem[teste]) >= 70:
                        <img src="/static/img/feed-pos.png" style=" display: block; margin-left: auto; margin-right: auto">
                    %elif int(porcentagem[teste]) >= 50 and int(porcentagem[teste]) <= 69:
                        <img src="/static/img/feed-med.png" style="display: block; margin-left: auto; margin-right: auto">
                    %elif int(porcentagem[teste]) >= 0 and int(porcentagem[teste]) <= 49:
                        <img src="/static/img/feed-neg.png" style="display: block; margin-left: auto; margin-right: auto">
                    %end
                </td>
            </tr>
            <tr class="hoover">

                <td  class="hiddenRow" colspan="3"> <div class="collapse grafico{{i['id']}}">
                    <div class="col-md-12" style="margin-top: 15px;">
                        <span class="word">Quantidades de vezes jogadas: {{vezes[teste]}}</span>
                        <br>
                        <span class="word">Média do aluno: {{porcentagem[teste]}}</span>
                        <br>
                        <span class="word">Nota da ultima vez jogada: {{ultima_vez}}</span>
                    </div>
                     
                <canvas id="myChart_grafico{{i['id']}}"></canvas> </div> </td>
            </tr>
          % else:
            <tr class="hoover">
                <td>{{i['descricao_descritor']}}</td>
                <td></td>
            </tr>
          % end
         %teste+=1
        % end
    </tbody>

</table>