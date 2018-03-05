% include('./header.tpl', title = 'Conecturma')
    <div class="row">
        <div align="center" class="col-md-12">
            <h1>Loja</h1>
            <br>
            <form action="/compras_loja">
                <div class="row">
                    %if array:
                        %for a in array:
                            {{type(a)}}
                        %end
                    %else:
                        <div class="col-md-3">
                            Medalha de Lata<br>
                            R$5,00<br>
                            <button type="submit" name="id" value="1">Comprar</button>
                        </div>
                        <div class="col-md-3">
                            Medalha de Bronze<br>
                            R$10,00<br>
                            <button type="submit" name="id" value="2">Comprar</button>
                        </div>
                        <div class="col-md-3">
                            Medalha de Prata<br>
                            R$15,00<br>
                            <button type="submit" name="id" value="3">Comprar</button>
                        </div>
                        <div class="col-md-3">
                            Medalha de Ouro<br>
                            R$20,00<br>
                            <button type="submit" name="id" value="4">Comprar</button>
                        </div>
                    %end


                </div>
            </form>
            <br>
            <a href="/user_menu"><button>voltar</button></a>
        </div>
    </div>
% include('./footer.tpl')