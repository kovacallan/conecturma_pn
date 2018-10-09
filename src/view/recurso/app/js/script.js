function botaoLigado(){
    document.getElementById("btn").src="../../app/img/botao-light.png";
}
function botaoDesligado(){
    document.getElementById("btn").src="../../app/img/botao-home.png";
}
//Inicio Matemática
var flagMatematica = 0;

function flagTeste(num){
    console.log(num);
    if(num>0){
       if(num == 1){
            document.getElementById("capituloUmMat").style.display = "none";
       }else {
            if(num == 2){
                document.getElementById("capituloDoisMat").style.display = "none";
            }else if(num == 3){
                document.getElementById("capituloTresMat").style.display = "none";
            }else if(num == 4){
                document.getElementById("capituloQuatroMat").style.display = "none";
            }else if(num == 5){
                document.getElementById("capituloCincoMat").style.display = "none";
            }else if(num == 6){
                document.getElementById("capituloSeisMat").style.display = "none";
            }else if(num == 7){
                document.getElementById("capituloSeteMat").style.display = "none";
            }else if(num == 8){
                document.getElementById("capituloOitoMat").style.display = "none";
            }else{
                console.log('deu ruim');
            }    
        }
    }else{
        console.log("menor");
    }
}
function showCapituloMatematicaUm(){
    var capitulo = document.getElementById("capituloUmMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";    
        flagMatematica = 0;
    }else{
        flagTeste(flagMatematica); 
        capitulo.style.display = "block";
        flagMatematica = 1;
    }
}

function showCapituloMatematicaDois(){
    var capitulo = document.getElementById("capituloDoisMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagMatematica = 0;    
    }else{  
        flagTeste(flagMatematica);
        capitulo.style.display = "block";
        flagMatematica = 2;
    }
}
function showCapituloMatematicaTres(){
    var capitulo = document.getElementById("capituloTresMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagMatematica = 0;    
    }else{  
        flagTeste(flagMatematica); 
        capitulo.style.display = "block";
        flagMatematica = 3;        
    }
}

function showCapituloMatematicaQuatro(){
    var capitulo = document.getElementById("capituloQuatroMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagMatematica = 0;    
    }else{  
        flagTeste(flagMatematica); 
        capitulo.style.display = "block";
        flagMatematica = 4;
    }
}
function showCapituloMatematicaCinco(){
    var capitulo = document.getElementById("capituloCincoMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagMatematica = 0;    
    }else{  
        flagTeste(flagMatematica); 
        capitulo.style.display = "block";
        flagMatematica = 5;        
    }
}

function showCapituloMatematicaSeis(){
    var capitulo = document.getElementById("capituloSeisMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagMatematica = 0;    
    }else{  
        flagTeste(flagMatematica); 
        capitulo.style.display = "block";
        flagMatematica = 6;        
    }
}
function showCapituloMatematicaSete(){
    var capitulo = document.getElementById("capituloSeteMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagMatematica = 0;    
    }else{  
        flagTeste(flagMatematica); 
        capitulo.style.display = "block";
        flagMatematica = 7;        
    }
}

function showCapituloMatematicaOito(){
    var capitulo = document.getElementById("capituloOitoMat");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none"; 
        flagMatematica = 0;   
    }else{  
        flagTeste(flagMatematica); 
        capitulo.style.display = "block";
        flagMatematica = 8;        
    }
}
//Fim

//inicio Português
var flagPortugues = 0;

function flagTestePortugues(num){
    console.log(num);
    if(num>0){
       if(num == 1){
            document.getElementById("capituloUmPort").style.display = "none";
       }else {
            if(num == 2){
                document.getElementById("capituloDoisPort").style.display = "none";
            }else if(num == 3){
                document.getElementById("capituloTresPort").style.display = "none";
            }else if(num == 4){
                document.getElementById("capituloQuatroPort").style.display = "none";
            }else if(num == 5){
                document.getElementById("capituloCincoPort").style.display = "none";
            }else if(num == 6){
                document.getElementById("capituloSeisPort").style.display = "none";
            }else if(num == 7){
                document.getElementById("capituloSetePort").style.display = "none";
            }else if(num == 8){
                document.getElementById("capituloOitoPort").style.display = "none";
            }else{
                console.log('deu ruim');
            }    
        }
    }else{
        console.log("menor");
    }
}
function showCapituloPortuguesUm(){
    var capitulo = document.getElementById("capituloUmPort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";    
        flagPortugues = 0;
    }else{
        flagTestePortugues(flagPortugues); 
        capitulo.style.display = "block";
        flagPortugues = 1;
    }
}

function showCapituloPortuguesDois(){
    var capitulo = document.getElementById("capituloDoisPort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagPortugues = 0;    
    }else{  
        flagTestePortugues(flagPortugues);
        capitulo.style.display = "block";
        flagPortugues = 2;
    }
}
function showCapituloPortuguesTres(){
    var capitulo = document.getElementById("capituloTresPort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagPortugues = 0;    
    }else{  
        flagTestePortugues(flagPortugues); 
        capitulo.style.display = "block";
        flagPortugues = 3;        
    }
}

function showCapituloPortuguesQuatro(){
    var capitulo = document.getElementById("capituloQuatroPort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagPortugues = 0;    
    }else{  
        flagTestePortugues(flagPortugues); 
        capitulo.style.display = "block";
        flagPortugues = 4;
    }
}
function showCapituloPortuguesCinco(){
    var capitulo = document.getElementById("capituloCincoPort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagPortugues = 0;    
    }else{  
        flagTestePortugues(flagPortugues); 
        capitulo.style.display = "block";
        flagPortugues = 5;        
    }
}

function showCapituloPortuguesSeis(){
    var capitulo = document.getElementById("capituloSeisPort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagPortugues = 0;    
    }else{  
        flagTestePortugues(flagPortugues); 
        capitulo.style.display = "block";
        flagPortugues = 6;        
    }
}
function showCapituloPortuguesSete(){
    var capitulo = document.getElementById("capituloSetePort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none";
        flagPortugues = 0;    
    }else{  
        flagTestePortugues(flagPortugues); 
        capitulo.style.display = "block";
        flagPortugues = 7;        
    }
}

function showCapituloPortuguesOito(){
    var capitulo = document.getElementById("capituloOitoPort");
    if(capitulo.style.display == "block"){
        capitulo.style.display = "none"; 
        flagPortugues = 0;   
    }else{  
        flagTestePortugues(flagPortugues); 
        capitulo.style.display = "block";
        flagPortugues = 8;        
    }
}
//fim