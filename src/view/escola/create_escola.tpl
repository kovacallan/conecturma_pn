%include('./header.tpl', title="Conecturma")
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Cadastro</h1>
        <form action="/escola/criar_escola" method="post">
         Nome da escola:   <input type="text" name="nome"/><br>
         Telefone:          <input type="text" name="telefone"/><br>
         Cep:          <input type="text" name="cep"/><br>
         Estado     <input type="text" name="estado" /><br>
         Uf:
            <select name="uf">
                <option value="">-- Selecione --</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Rorâima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
            </select><br>
         Numero:    <input type="text" name="numero"/><br>
         Rede:
            %if observador_tipo == '1':
                <select name = "rede">
                    <option value="{{rede['id']}}">{{rede['nome']}}</option>
                </select><br>
            % else:
                <select name = "rede">
                    %if observador_tipo == '0':
                        <option value="0"></option>
                        % for e in rede:
                            <option value="{{e['id']}}">{{e['nome']}}</option>
                        % end
                    %end
                </select><br>
            % end
         <button type="submit">Enviar</button>
        </form>
        <a href="/escola"><button>Voltar</button></a>


    </div>
</div>
%include('footer.tpl')