% include('./header.tpl', title = 'Conecturma')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Observador</h1>
        <br>
        <form action="observador/cadastro">
            <input type="radio" name="tipo_observador" value="0" checked>Administrador
            <input type="radio" name="tipo_observador" value="1">Gestor
            <input type="radio" name="tipo_observador" value="2">Diretor
            <input type="radio" name="tipo_observador" value="3">Professor
            <input type="radio" name="tipo_observador" value="4">Responsável
            <br>
            <button type="submit">Cadastro Observador</button>
        </form>
        <a href="/">
            <button>voltar</button>
        </a>
        <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-2">
                </div>
                <div class="col-md-3">
                    Nome
                </div>
                <div class="col-md-3">
                    tipo
                </div>
                <div class="col-md-3">
                </div>
            </div>
            % for e in observador:
            <div class="row">
                <div class="col-md-2">

                </div>
                <div class="col-md-3">
                    {{e['nome']}}
                </div>
                <div class="col-md-3">
                    {{e['tipo']}}
                </div>
                <div class="col-md-3">
                    {{e['escola']}}
                </div>
            </div>
            % end

    </div>
</div>
% include('./footer.tpl')