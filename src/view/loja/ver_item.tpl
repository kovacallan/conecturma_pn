% include('./header.tpl', title = 'Conecturma')
<div align="center" class="col-md-12">
    <h1>Ver Itens Loja:</h1>
    <div class="row">
        <div class="col-md-3">
            <h2>id</h2>
            <br>
        </div>
        <div class="col-md-3">
            <h2>Nome Item</h2>
            <br>
        </div>
        <div class="col-md-3">
            <h2>Tipo Item</h2>
            <br>
        </div>
        <div class="col-md-3">
            <h2>Preco Item</h2>
            <br>
        </div>
        %for itens in teste:
        <div class="col-md-3">
            {{itens.id}}
            <br>
            <br>
        </div>
        <div class="col-md-3">
            {{itens.nome_item}}
            <br>
            <br>
        </div>
        <div class="col-md-3">
            {{itens.tipo_item}}
            <br>
            <br>
        </div>
        <div class="col-md-3">
            {{itens.preco_item}}
            <br>
            <br>
        </div>
        %end
    </div>
    <a href="/user_menu">
        <button>Voltar</button>
    </a>
</div>

        % include('footer.tpl')