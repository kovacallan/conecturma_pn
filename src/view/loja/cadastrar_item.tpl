%include('./header.tpl', title="Conecturma")
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Cadastro</h1>
        <form action="/cadastro_item" method="post">
         Nome do item:   <input type="text" name="nome_item"/><br>
         Preço :         <input type="text" name="preco_item"/><br>
         <select name="tipo_item">
           <option value="1">Cores</option>
           <option value="2">Rosto</option>
           <option value="3">Acessorios</option>
           <option value="4">Corpo</option>
         </select><br>
         <button type="submit">Enviar</button>
        </form>
        <a href="/aluno"><button>Voltar</button></a>
    </div>
</div>
%include('footer.tpl')