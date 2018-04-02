% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-6">
            <h1>Bem Vindo {{usuario}} </h1>
            <h2>A Conecturma!</h2>
            <br>
            % if tipo == "PROFESSOR":
                <a id="2" href="/aluno"><button>Aluno</button>
            % elif tipo == "DIRETOR":
                <a href="/turma"><button>turma</button></a>
                <a id="2" href="/aluno"><button>Aluno</button>
            % elif tipo == "GESTOR":
                <a href="/rede"><button>rede</button></a>
                <a href="/escola"><button>escola</button></a>
                <a href="/turma"><button>turma</button></a>
                <a id="2" href="/aluno"><button>Aluno</button>
            % end
            <a href="/sair"><button>Sair</button></a>
        </div>
    </div>
% include('footer.tpl')