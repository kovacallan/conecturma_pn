<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="static/bootstrap-grid.min.css">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div align="right" class="col-md-10">
            %if tipo =='0':
                <a href="/"><button>voltar</button></a>
            %end
                <a href="/sair"><button>Sair</button></a>
            </div>
        </div>

        <div class="row">
            <div align="center" class="col-md-2" style="margin-top:50px;">
                <h2>Menu</h2>
                % if tipo == '3':
                    <a href="/usuario">USUÁRIOS</a><br>
                    <a href="/medalha_cadastro">Criar medalha</a><br>
                    <a href="/ler_medalha">Ler medalhas criadas</a><br>
                % elif tipo == '2':
                    <a href="/turma">TURMA</a><br>
                    <a href="/usuario">USUÁRIOS</a><br>
                % elif tipo == '1':
                    <a href="/escola">ESCOLA</a><br>
                    <a href="/turma">TURMA</a><br>
                    <a href="/usuario">USUÁRIOS</a><br>
                % elif tipo == '0':
                    <a href="/rede">REDE</a><br>
                    <a href="/escola">ESCOLA</a><br>
                    <a href="/turma">TURMA</a><br>
                    <a href="/usuario">USUÁRIOS</a><br>
                % end
            </div>
            <div class="col-md-10">
                <div align="center">
                    <h2>Bem Vindo {{usuario}} </h2>
                    <h3>A Conecturma!</h3>
                </div>
            </div>
        </div>
    </div>
</body>
</html>