function ResetarCampos(){
    let inputs = document.getElementsByClassName("inputs")
    for(let x of inputs){
        x.value = ""
    }
    
}

function EnviarDados(){
    let inputs = document.getElementsByClassName("inputs")
    let v_inp_1 = document.getElementById("input1").value
    let v_inp_2 = document.getElementById("input2").value

    window.location.href = "painel_estudante.htm?nome=" + encodeURIComponent(v_inp_1) + "&curso=" + encodeURIComponent(v_inp_2)
}