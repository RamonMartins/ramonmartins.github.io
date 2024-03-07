var funcionarios = null;
var lista = [];
var listaCard = document.getElementById("lista-card");

function buscar(){
    return fetch("usuarios.json")
        .then(response => response.json())
        .then(data => {
            funcionarios = data;
            alert(funcionarios);
        });
}

buscar().then(() => {
    (function() {
        window.Main = {};
        Main.Page = (function() {
            var mosq = null;
            function Page() {
                var _this = this;
                mosq = new Mosquitto();

                _this.connect();

                mosq.onconnect = function(rc){
                    var aviso = "Conectado ao Servidor!";
                    $("#debug").html(aviso);
                    
                    var topic = "RamonRecebeCoisasAvulsas";
                    mosq.subscribe(topic, 0);
                    
                };
                mosq.ondisconnect = function(rc){
                    var aviso = "A conexão com o Servidor foi perdida <br> Tentando se reconectar novamente...";
                    $("#debug").html(aviso);

                    var url = "ws://broker.hivemq.com:8000/mqtt";
                    mosq.connect(url);
                };
                mosq.onmessage = function(topic, payload, qos){
                    if(funcionarios){
                        if(!lista.includes(payload[0])){
                            lista.push(payload[0]);
                            addCard(payload);
                        }
                    }
                };
            }

            Page.prototype.connect = function(){
                var url = "ws://broker.hivemq.com:8000/mqtt";
                mosq.connect(url);
            };

            Page.prototype.disconnect = function(){
                mosq.disconnect();
            };
            
            return Page;
        })();
        $(function(){
            return Main.controller = new Main.Page;
        });
    }).call(this);
});

function addCard(idUser){
    let indice;

    for(let x in funcionarios){
        if(funcionarios[x].id == idUser[0]){
            indice = x;
        }
    }

    listaCard.innerHTML += `
        <div class="card">
            <p>${funcionarios[indice].nome}</p>
            <p>${funcionarios[indice].dataNascimento}</p>
            <p>${funcionarios[indice].funcao}</p>
            <p>${idUser}</p>
        </div>
    `;
}
