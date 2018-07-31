<div class="row">
            <div class="tab-pane fade show active container active" role="tabpanel" aria-labelledby="home-tab" id="dados-da-escola">
                <div class="row distanciamneto" style="margin-top: 30px">
                    <div class="offset-md-1 col-md-">
                        <img src="/static/img/editar-foto.png">
                    </div>
                    <div class="offset-md-1 col-md-7">
                        <div class="row distanciamneto">
                            <div class=" col-md-">
                                <label for="nome"  style="background-color: inherit;">Nome:<span style="color:#ff0000">*</span></label>
                                <input type="text" class="form-control" size="30" name="" id="nome">
                            </div>
                        <div class="col-md-" style="padding-left: 10px">
                            <label for="CNPJ" >CNPJ</label><br>
                            <input type="text" size="25" class="form-control" name="" id="CNPJ">
                        </div>
                    </div>
                    <div class="row distanciamento">
                        <div class="col-md-">
                            <label for="telefone">Telefone:<span style="color:#ff0000">*</span></label>
                            <input type="text" class="form-control" size="26" name="" id="telefone">
                        </div>
                        <div class="col-md-" style="padding-left: 10px ;">
                            <label for="diretor">Diretor</label><br>
                            <input type="text" size="29" class="form-control" name="" id="diretor">
                        </div>
                    </div>
                    <div class="row distanciamneto">
                        <div class="col-md-">
                            <label for="rede">Rede de Ensino:<span style="color:#ff0000">*</span></label>
                            <input type="text" size="59" class="form-control" name="" id="rede">
                        </div>
                    </div>
                </div>

                <div class="offset-md-1 row distanciamento" style="" >
                    <div class="col-md-" >
                        <label for="endereco">Endereço</label>
                        <input type="text" class="form-control" size="50" name="endereco" id="rede">
                    </div>
                    <div class="col-md-" style="padding-left: 10px ;">
                        <label for="numero">Numero</label>
                        <input type="text" class="form-control" size="5" name="numero" id="numero">
                    </div>
                    <div class="col-md-" style="padding-left: 9px ;">
                        <label for="bairro">Bairro</label>
                        <input type="text" class="form-control" size="24" name="bairro" id="bairro">
                    </div>
                </div>
                <div class="offset-md-1 row distanciamento">
                    <div class="col-md-" >
                        <label for="complemento">Complemento</label>
                        <input type="text" class="form-control" size="50" name="endereço" id="complemento">
                    </div>
                    <div class="col-md-" style="padding-left: 10px ;">
                        <label for="cep">CEP</label>
                        <input type="text" class="form-control" size="32" name="cep" id="cep">
                    </div>
                </div>
                <div class="offset-md-1 row distanciamento">
                    <div class="col-md-" >
                        <label for="estado">Estado</label>
                        <input type="text" class="form-control" size="50" name="estado" id="estado">
                    </div>
                    <div class="col-md-" style="padding-left: 10px ;">
                        <label for="municipio">Municipio</label>
                        <input type="text" class="form-control" size="32" name="municipio" id="municipio">
                    </div>
                </div>
            </div>
        </div>
        <br>
    </div>
    <div class="container" style="margin-top:20px;margin-bottom: 20px">
        <div class="row">
            <div class="offset-md-9 distanciamento">
                <button type="submit" class="botao-salvar" style="margin-left: 10px;">salvar</button>
                <button class="botao-salvar" style="background-color:#ff0000" onclick='document.getElementById("new_school").style.display = "none"'>cancelar</button>
            </div>
        </div>
    </div>
</div>