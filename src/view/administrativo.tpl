% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-8">

            <h1>Bem Vindo Administrador </h1>

            <h2>A Conecturma!</h2>

        <form action="/pesquisar_aluno">

            nome do estudante:<br>

        <input type="text" name="nome_do_aluno" value="nome do estudante">

        <br>

            turma:<br>
        <input type="text" name="nome_da_turma" value="escola">
        <br><br>
        <input type="submit" value="Pesquisar">
        </form>
         <a href="administrador/gestao_aprendizage"><button >gestao de aprendizagem</button></a>

        <a href="jogarconecturma"><button>jogar conecturma</button></a>

        <button>ver usuarios inativados</button>

            <a href="/sair"><button>Sair</button></a>
        </div>

        <%
            for x in historico:
        %>
        <div class="col-md-7">
            <div class="row-">
                <div class="col-md-7">
                    {{x['nome']}}
                </div>
                <div class="col-md-7">
                    {{x['tipo_usuario']}}
                </div>
                <div class="col-md-7">
                    {{x['data_acesso']}}
                </div>
            </div>
            <br>
        </div>
            <%
            end
        %>
    </div>
% include('footer.tpl')