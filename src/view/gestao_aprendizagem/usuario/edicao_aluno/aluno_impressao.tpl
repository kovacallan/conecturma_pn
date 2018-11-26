
                                    <div class="row distanciamento" style="margin-left: 5px;">

                                        <div class="col-md-">
                                            <label for="login">login</label>
                                            <span style="color:#ff0000">*</span>
                                            <input type="text" size="25" class="form-control disabled{{aluno['id']}}"
                                                   name="" id="aluno_login{{aluno['id']}}" value="{{aluno['nome_login']}}"
                                                   style="text-transform:uppercase;" disabled>
                                        </div>

                                        <div class="col-md-" style="margin-left: 100px;">
                                            <label for="login">senha</label>
                                            <span style="color:#ff0000">*</span>

                                            <div class="row">
                                                <img src="/static/img/{{aluno['senha'][0]}}.png" style="padding-left:15px;">
                                                <img src="/static/img/{{aluno['senha'][1]}}.png" style="padding-left:15px;">
                                                <img src="/static/img/{{aluno['senha'][2]}}.png" style="padding-left:15px;">
                                                <img src="/static/img/{{aluno['senha'][3]}}.png" style="padding-left:15px;">
                                            </div>
                                        </div>

                                    </div>