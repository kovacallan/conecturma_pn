%include('./header.tpl', title = 'Conecturma')
<div class="row">
    <div align="center" class="col-md-12">
        <h1>Escrever anotações</h1>
        <form action="/anotaçoes_aluno" method="post">
         <input type="text" name="Nome" size="100" />
         <button type="submit">Enviar</button>
        </form>
        <a href="/aluno"><button>Voltar</button></a>
    </div>
</div>

%include('footer.tpl')