
<div class="container" style="border: 1px solid black;width: 335px;background-color: lightgray;">
                                    <div class="row distanciamento" style="margin-left: 5px;">

                                        <div class="col-md-2">
                                            <label for="login" style="text-transform: uppercase;">login</label>
                                            <span style="color:#ff0000">*</span>
                                            <input type="text" size="30" class="form-control disabled{{aluno['id']}}"
                                                   name="" id="aluno_login{{aluno['id']}}" value="{{aluno['nome_login']}}"
                                                   style="text-transform:uppercase;" disabled>
                                        </div>

                                        <div class="col-md-5" style="margin-left:0 ; margin-top: 50px;">
                                            <label for="login" style="text-transform: uppercase;">senha</label>
                                            <span style="color:#ff0000">*</span>

                                            <div class="row">
                                                <img src="/static/img/{{aluno['senha'][0]}}.png" style="padding-left:15px;">
                                                <img src="/static/img/{{aluno['senha'][1]}}.png" style="padding-left:15px;">
                                                <img src="/static/img/{{aluno['senha'][2]}}.png" style="padding-left:15px;">
                                                <img src="/static/img/{{aluno['senha'][3]}}.png" style="padding-left:15px;">
                                            </div>
                                        </div>

                                    </div>
    </div>

<script>
    window.onload = window.print();
</script>