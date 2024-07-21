function EnviarDados(){
    let v_inp_1 = document.getElementById("info_nome").value
    let v_inp_2 = document.getElementById("info_email").value
    let v_inp_3 = document.getElementById("info_curso").value
    let v_inp_4 = document.getElementById("info_foto").files[0]

    sessionStorage.removeItem('imagem') // Limpar a imagem anterior

    if (v_inp_4) {
        const reader = new FileReader()
        reader.onload = function (e) {
            sessionStorage.setItem('imagem', e.target.result)
        };
        reader.readAsDataURL(v_inp_4)
    }
    
    window.location.href = "painel_estudante.htm?nome=" + encodeURIComponent(v_inp_1) + "&email=" + encodeURIComponent(v_inp_2) + "&curso=" + encodeURIComponent(v_inp_3)
}


function ResetarCampos(){
    let inputs = document.getElementsByClassName("inputs")
    for(let x of inputs){
        x.value = ""
    }
    
}

ResetarCampos()