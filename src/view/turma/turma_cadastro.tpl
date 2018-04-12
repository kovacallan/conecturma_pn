% include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Cadastro de Turmas</h1>
             <form action="/turma/cadastro_turma" method="post">
                 Turma:*  <input type="text" name="turma_nome"/>
                 <select name="serie">
                     <option value="0">pré-escola</option>
                     <option value="1">1ª Ano</option>
                     <option value="2">2ª Ano</option>
                     <option value="3">3ª Ano</option>
                 </select>
                 Escola*
                 % if observador_tipo is '2':
                    <select name="escola">
                        <option value="{{escolas['id']}}">{{escolas['nome']}}</option>
                     </select><br>
                 % else:
                    <select name="escola">
                        %   if escolas == None:
                                <option value="0">Sem escola Cadastrada</option>
                            %else:
                        %       for e in escolas:
                                <option value="{{e['id']}}">{{e['nome']}}</option>
                        %       end
                        %   end
                     </select><br>
                 % end
                 <button type="submit">Enviar</button>
            </form>
            <a href="/turma"><button>Voltar</button></a>
        </div>
    </div>
% include('./footer.tpl')