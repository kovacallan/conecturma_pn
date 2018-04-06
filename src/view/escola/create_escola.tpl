%include('./header.tpl', title="Conecturma")
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Cadastro</h1>
        <form action="create_escola">
         Nome da escola:   <input type="text" name="nome"/><br>
         Rua:          <input type="text" name="rua"/><br>
         Numero:    <input type="text" name="numero"/>
         Telefone:          <input type="text" name="telefone"/><br>
         Estado     <input type="text" name="estado" />
         Cidade:          <input type="text" name="cidade"/><br>
         Rede:
            <select name = "rede">
                <option value="0"></option>
                % for r in rede:
                    <option value="{{r['id']}}">{{r['nome']}}</option>
                %end
            </select>
         COD ID:          <input type="text" name="cod_id" /><br>
         <button type="submit">Enviar</button>
        </form>
        <a href="/escola"><button>Voltar</button></a>


    </div>
</div>
%include('footer.tpl')