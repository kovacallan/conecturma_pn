% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Bem Vindo!</h1>
            <h2>A Conecturma</h2>
            <form action="/jogos" method="get">
                <button type="submit" name="n1" value="j1">Jogo 1</button>
                <button type="submit" name="n1" value="j2">Jogo 2</button>
            </form>
            <br>
            <a href="/mostrar_score"><button type="submit" >SCORE</button></a>
            <a href="/aluno"><button>Aluno</button></a>

            <a href="/turma"><button>turma</button></a>

            <a href="/"><button>Voltar a tela de login</button></a>
        </div>
    </div>

% include('footer.tpl')