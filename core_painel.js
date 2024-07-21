document.addEventListener("DOMContentLoaded", function() {
    // Coletar dados vindos da página index
    let parametros = new URLSearchParams(window.location.search)
    let nome = parametros.get("nome").toUpperCase()
    let email = parametros.get("email")
    let curso = parametros.get("curso").toUpperCase()
    

    // Coletar datas atuais para usos posteriores
    let data_atual = new Date()
    let ano_atual = data_atual.getFullYear()
    let mes_atual = data_atual.getMonth()
    

    // Alterar o nome em mais de um lugar
    let busca_nomes = document.getElementsByClassName("info_nome")
    for(let x of busca_nomes){
        x.textContent = nome
    }


    // Alterar o Prédio do curso
    let busca_predio = document.getElementById("info_predio")
    let predio_CCHL = ("CCHL - ADMINISTRAÇÃO", "CCHL - DIREITO")
    let predio_CCN = ("CCN - CIÊNCIA DA COMPUTAÇÃO", "CCN - FÍSICA", "CCN - MATEMÁTICA")
    let predio_CT = ("CT - ENGENHARIA CIVIL", "CT - ENGENHARIA DE PRODUÇÃO", "CT - ENGENHARIA ELÉTRICA")

    if(predio_CCHL.includes(curso)){
        busca_predio.textContent = "CENTRO DE CIENCIAS HUMANAS E LETRAS"
    }else if(predio_CCN.includes(curso)){
        busca_predio.textContent = "CENTRO DE CIENCIAS DA NATUREZA"
    }else if(predio_CT.includes(curso)){
        busca_predio.textContent = "CENTRO DE TECNOLOGIA"
    }else{
        busca_predio.textContent = "CENTRO DE CIENCIAS DA NATUREZA"
    }


    // Alterar Semestre atual
    let busca_semestre = document.getElementById("info_semestre")
    /* Contagem dos meses no JavaScript começa em 0 e nao 1,
        então o intervalo de meses é de 0 - 11 */
    if(mes_atual < 6){
        busca_semestre.textContent = ano_atual + "." + 1
    }else{
        busca_semestre.textContent = ano_atual + "." + 2
    }
    

    // Alterar nº matrícula
    let busca_matricula = document.getElementById("info_matricula")
    busca_matricula.textContent = (ano_atual - 1).toString() + Math.floor(100000 + Math.random() * 900000)
    

    // Alterar o curso
    let busca_curso = document.getElementById("info_curso")
    busca_curso.textContent = curso


    // Alterar o e-mail
    let busca_email = document.getElementById("info_email")
    busca_email.textContent = email


    // Alterar data de entrada no curso
    let busca_entrada = document.getElementById("info_entrada")
    busca_entrada.textContent = ano_atual - 1
    
});