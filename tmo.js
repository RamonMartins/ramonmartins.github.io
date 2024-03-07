var funcionarios = null;
var lista = [];
var listaCard = document.getElementById("lista-card");

async function buscar(){
	let busca = await fetch("https://raw.githubusercontent.com/RamonMartins/ramonmartins.github.io/master/usuarios.json");
	funcionarios = await busca.json();
}

buscar();

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
				
				//var topic = $('#pub-subscribe-text')[0].value;
				var topic = "ProjectTecnoBrainRecebe";
				mosq.subscribe(topic, 0);
				
			};
			mosq.ondisconnect = function(rc){
				var aviso = "A conexão com o Servidor foi perdida <br> Tentando se reconectar novamente...";
				$("#debug").html(aviso);

				var url = "ws://broker.hivemq.com:8000/mqtt";
				mosq.connect(url);
			};
			mosq.onmessage = function(topic, payload, qos){
				var decodificada = decodeURIComponent(escape(payload))
				let indiceTraco = decodificada.indexOf(" - ");
				var statusSemId = decodificada.substring(indiceTraco + 3);
				
				if(funcionarios){
					if(!lista.includes(decodificada[0])){
						lista.push(decodificada[0]);
						addCard(decodificada, statusSemId);
					}
				}

				
				if(statusSemId == "Dentro da área & Sem uso do capacete"){
					$("#cardUser" + decodificada[0]).html(statusSemId).css("color", "red");
				}else if(statusSemId == "Dentro da área & Com uso do capacete"){
					$("#cardUser" + decodificada[0]).html(statusSemId).css("color", "green");
				}else{
					$("#cardUser" + decodificada[0]).html(statusSemId).css("color", "red");
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


function addCard(idUser, statusSemId){
	let indice = null;

	for(let x in funcionarios){
		if(funcionarios[x].id == idUser[0]){
			indice = x;
		}
	}

	listaCard.innerHTML += `
		<div class="card">
			<span><b>Nome:</b> ${funcionarios[indice].nome}</span>
			<span><b>Data Nascimento:</b> ${funcionarios[indice].dataNascimento}</span>
			<span><b>Função:</b> ${funcionarios[indice].funcao}</span>
			<div>
				<span><b>Status:</b></span>
				<span id="cardUser${idUser[0]}">${statusSemId}</span>
			</div>
			
		</div>
	`;
}
