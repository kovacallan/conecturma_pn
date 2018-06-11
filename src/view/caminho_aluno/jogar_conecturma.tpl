% include('header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-3">
            <h1>Avatar </h1>
            Cor:{{avatar['cor']}}<br/>
            Rosto:{{avatar['rosto']}}<br/>
            Acessorio:{{avatar['acessorio']}}<br/>
            Corpo:{{avatar['corpo']}}<br/>
        </div>
        <div align="center" class="col-md-6">
            <h1>Bem Vindo {{usuario}} </h1>
            <h2>A Conecturma!</h2>
            <a><button>Jogo</button></a>
            <iframe src="/jogo" width="1024px" height="1000px"></iframe>
            <br>
            <a href="/aluno/loja"><button>Loja</button></a>
            <a href="/aluno/ver_itens_comprados"><button>Ver Itens</button></a>
            <a href="/sair"><button>Sair</button></a>
        </div>
    </div>
    <script>
        window.addEventListener("message", function(event){
            teste = JSON.parse(event.data);
            console.log("aqui BB " + teste.operacao);
        });
    </script>
% include('footer.tpl')
