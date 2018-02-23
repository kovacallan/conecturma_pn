<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Conecturma</title>
    <style>
        .id{
            text-align:center;
            float:left;
        }
        .nome{
            text-align:center;
            margin-left:10px;
            float:left;
        }
    </style>
</head>
<body>.
    <h1>Ver Alunos</h1>
    <div class="id">
        <h4>id da criança</h4>
        % for id in aluno_id:
            {{id}}
            <br>
        % end
    </div>
    <div class="nome">
        <h4>nome da criança</h4>
        % for aluno_nome in aluno_nome:
            {{aluno_nome}}
            <br>
        % end
    </div>
    <div class="senha">
        <h4>senha do aluno</h4>
        % for senha_aluno in senha_aluno:
            {{senha_aluno}}
            <br>
        % end
    </div>
    <br>
    <br>
    <br>
    <br>

    <a href="/"><button>Voltar</button></a>
</body>
</html>