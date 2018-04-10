% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-6">
            <h1>Bem Vindo {{usuario}} </h1>
            <h2>A Conecturma!</h2>
            <br>
            % if tipo == 3:
                <a href="/aluno"><button>Aluno</button>
                <a href="/medalha_cadastro"><button>Criar medalha</button>
                <a href="/ler_medalha"><button>Ler medalhas criadas</button></a>
            % elif tipo == 2:
                <a href="/turma"><button>turma</button></a>
                <a href="/aluno"><button>Aluno</button>
            % elif tipo == 1:
                <a href="/rede"><button>rede</button></a>
                <a href="/escola"><button>escola</button></a>
                <a href="/turma"><button>turma</button></a>
                <a href="/aluno"><button>Aluno</button>
            % elif tipo == 0:
                <a href="/loja"><button>loja</button></a>
                <a href="/rede"><button>rede</button></a>
                <a href="/escola"><button>escola</button></a>
                <a href="/turma"><button>turma</button></a>
                <a href="/aluno"><button>Aluno</button></a>
            % end
            <a href="/sair"><button>Sair</button></a>
        </div>
    </div>
% include('footer.tpl')