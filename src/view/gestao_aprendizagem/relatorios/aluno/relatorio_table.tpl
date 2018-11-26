<table  class="table table-bordered d-print-table" style="margin-top:0;">
   <thead style="background-color:#9ed0f6;">
      <tr style="color:#fff;">

        <th scope="col" >Id</th>
        <th scope="col" >Descritor</th>
        <th scope="col">Desempenho</th>
      </tr>
    </thead>

    <tbody  style="background-color:#f3f3f3;">
        %teste = 0
        %for i in oa:
            % if teste < len(porcentagem):
            <tr  class="hoover" style="cursor: pointer;" data-toggle="collapse" data-target="#grafico{{i['id']}}" aria-expanded="false" aria-controls="grafico{{i['id']}}" class="accordion-toggle" onclick="funcoes('grafico{{i['id']}}',{{pontos[teste]}})">
                <td colspan="1">{{i['sigla_oa'][8:9]}}.{{i['sigla_oa'][12]}}</td>
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
            <tr>

                <td id="printableArea" class="hiddenRow" colspan="3">
                    <div style="display:none" id = "grafico{{i['id']}}" class="accordian-body collapse grafico{{i['id']}}">
                        <h2 align="center" style="color:#299ae8;">Desempenho das últimas 10 vezes jogadas</h2>
                        <div class="col-md-12" style="margin-top: 15px; display:inline-flex;">
                            <span class="word">Quantidades de vezes jogadas: {{vezes[teste]}}</span>
                            <br>
                            <span class="word">Média do aluno: {{porcentagem[teste]}}</span>
                            <br>
                            <span class="word">Nota da última vez jogada: {{ultima_vez[teste]}}</span>
                        </div>

                        <canvas id="myChart_grafico{{i['id']}}"></canvas>
                    </div>
                </td>
            </tr>
          % else:
            <tr>
                <td colspan="1">{{i['sigla_oa'][8:9]}}.{{i['sigla_oa'][12]}}</td>
                <td>{{i['descricao_descritor']}}</td>
                <td></td>
            </tr>
          % end
         %teste+=1
        % end

    </tbody>
</table>