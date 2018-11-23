<table class="table table-bordered" style="margin-top:0;">
   <thead style="background-color:#9ed0f6;">
      <tr style="color:#fff;">

        <th scope="col" >Id</th>
        <th scope="col" >Descritor</th>
        <th scope="col">Desempenho</th>
      </tr>
    </thead>

    <tbody style="background-color:#f3f3f3;">
        %teste = 0
        %for i in oa:
            % if teste < len(porcentagem):
            <tr  style="cursor: pointer;" class="accordion-toggle hoover ex" onclick="grafico_turma('grafico{{i['id']}}', {{alunos}}, {{notas[teste]}});esconder('grafico{{i['id']}}')">

                <td colspan="1">{{i['sigla_oa'][8:9]}}.{{i['sigla_oa'][12]}}</td>
                <td>{{i['descricao_descritor']}}</td>
                  <td>
                    %if int(porcentagem[teste]) >= 70:
                        <img src="/static/img/feed-pos.png" style="display: block; margin-left: auto; margin-right: auto">
                    %elif int(porcentagem[teste]) >= 50 and int(porcentagem[teste]) <= 69:
                        <img src="/static/img/feed-med.png" style="display: block; margin-left: auto; margin-right: auto">
                    %elif int(porcentagem[teste]) >5 and int(porcentagem[teste]) <= 49:
                        <img src="/static/img/feed-neg.png" style="display: block; margin-left: auto; margin-right: auto">
                    %end
                </td>
            </tr>
            <tr>

                <td  class="hiddenRow" colspan="3"> <div class="accordian-body collapse grafico{{i['id']}}">
                    <div class="col-md-12" style="margin-top: 15px;">
                        <span class="word">Média da turma: {{int(porcentagem[teste])}}</span>
                        <select id="ordenarGraficoRelatorio_grafico{{i['id']}}" onchange="ordenarGraficoRelatorio('grafico{{i['id']}}', {{alunos}}, {{notas[teste]}}, 1)">
                            <option value="1">Ordenar por ordem alfabética</option>
                            <option value="2">Ordenar pela menor nota</option>
                            <option value="3">Ordenar pela maior nota</option>
                        </select>
                    </div>
                    <div id="grafico_grafico{{i['id']}}">
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
<script>


</script>