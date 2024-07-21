function ResetarCampos(){
    let inputs = document.getElementsByClassName("inputs")
    for(let x of inputs){
        x.value = ""
    }
    
}

function EnviarDados(){
    let v_inp_1 = document.getElementById("info_nome").value
    let v_inp_2 = document.getElementById("info_email").value
    let v_inp_3 = document.getElementById("info_curso").value

    window.location.href = "painel_estudante.htm?nome=" + encodeURIComponent(v_inp_1) + "&email=" + encodeURIComponent(v_inp_2) + "&curso=" + encodeURIComponent(v_inp_3)
}