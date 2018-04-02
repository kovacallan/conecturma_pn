% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-6">
            <h1>Bem Vindo {{usuario}} </h1>
            <h2>A Conecturma!</h2>
            <br>
            % if tipo == 3:
                <a id="2" href="/aluno"><button>Aluno</button>
            % elif tipo == 2:
                <a href="/turma"><button>turma</button></a>
                <a id="2" href="/aluno"><button>Aluno</button>
            % elif tipo == 1:
                <a href="/rede"><button>rede</button></a>
                <a href="/turma"><button>turma</button></a>
                <a id="2" href="/aluno"><button>Aluno</button>
            % end
            <a href="/sair"><button>Sair</button></a>
        </div>
    </div>
% include('footer.tpl')