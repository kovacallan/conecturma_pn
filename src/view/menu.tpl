% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-3">
            <h1>Avatar </h1>
            <%
                if avatar:
            %>
                    Cor:{{avatar['cor'].nome_item}}<br/>
                    Rosto:{{avatar['rosto'].nome_item}}<br/>
                    Acessorio:{{avatar['acessorio'].nome_item}}<br/>
                    Corpo:{{avatar['corpo'].nome_item}}<br/>
             <%
                else:
                    pass
                end
             %>
        </div>

        <div align="center" class="col-md-6">
            <h1>Bem Vindo {{usuario}} </h1>
            <h2>A Conecturma!</h2>
            <form action="/jogos" method="get">
                <button type="submit" name="n1" value="j1">Jogo 1</button>
                <button type="submit" name="n1" value="j2">Jogo 2</button>
            </form>
            <br>
            <a href="/mostrar_score"><button type="submit" >SCORE</button></a>
            <a href="/aluno"><button>Aluno</button></a>
            <a href="/turma"><button>turma</button></a>
            <a href="/loja"><button>Loja</button></a>
            <a href="/sair"><button>Sair</button></a>
        </div>
    </div>
% include('footer.tpl')
