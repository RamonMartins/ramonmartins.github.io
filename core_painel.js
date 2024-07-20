document.addEventListener("DOMContentLoaded", function() {
    let parametros = new URLSearchParams(window.location.search)
    let nome = parametros.get("nome").toUpperCase()
    let curso = parametros.get("curso").toUpperCase()
    console.log(nome)
    console.log(curso)
    
    
    let busca_nomes = document.getElementsByClassName("nome-user-trocar")
    for(let x of busca_nomes){
        x.textContent = nome
    }
    
    let busca_curso = document.getElementById("curso-user-trocar")
    busca_curso.textContent = curso
});