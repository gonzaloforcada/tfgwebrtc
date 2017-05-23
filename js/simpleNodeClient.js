//Importante coger el Id donde quiero los mensajes
div = document.getElementById('mensajes');

//Conexión al servidor
var socket = io.connect('http://localhost:8080');


//Obtener la sala y el nombre de usuario
//Se cambia el prompt y se crea un cuadro de texto que pasa como parámetros el nombre de usuario y el canal/sala al que se quiere unir/crear.
//En caso de que la sala
var channel;
var username;
function funcionEntrar(){
    channel = document.getElementById('channel').value;
    username = document.getElementById('uname').value;
    document.getElementById('id01').style.display='none';
    if (channel !== "") {
	console.log('Intentando unirse o crear: ', channel);
	// enviar 'create or join' al servidor
	socket.emit('create or join', channel);
    } else {
        alert("Nombre de usuario y/o de la sala vac\u00EDo. Actualice la p\u00E1gina y rellene todos los campos para continuar.");
    }
}

function funcionEnviar(){
	var myResponse = document.getElementById('mensajeEnviar').value;
    
    document.getElementById('mensajeEnviar').value = '';
    div.insertAdjacentHTML( 'beforeEnd', '<p class="local">' +
		myResponse + '</p><br>');
	//Send it to remote peer (through server)
	socket.emit('message', {
		channel: channel,
		message: myResponse});
}


//mensaje 'created'
socket.on('created', function (channel){
	console.log('Se ha creado el canal ' + channel);
	console.log('Usted es el creador del canal');

	// Dynamically modify the HTML5 page
	div.insertAdjacentHTML( 'beforeEnd', '<p>Se ha creado el canal '+channel+'</p>');
	div.insertAdjacentHTML( 'beforeEnd', '<p>Usted es el creador de '+ channel+ '. Comparta este nombre del canal con el resto de usuarios </p>');
    //poner nombre de la sala en el menú lateral en el campo roomName
    document.getElementById('roomName').insertAdjacentHTML('afterbegin',channel);
});


//Handle 'full' message
socket.on('full', function (channel){
	console.log('channel ' + channel + ' is too crowded! \
		Cannot allow you to enter, sorry :-(');

	div.insertAdjacentHTML( 'beforeEnd', 'La sala ' + channel +
		' está completa, no puede unirse </p>');
});

//Handle 'remotePeerJoining' message
socket.on('remotePeerJoining', function (channel){
	console.log('Request to join ' + channel);
	console.log('You are the initiator!');

	div.insertAdjacentHTML( 'beforeEnd', '<p style="color:red"> Mensaje del servidor: solicitud de '+username+' de unirse a  ' +
		channel + '</p>');
});

//Handle 'joined' message
socket.on('joined', function (msg){
	console.log('Message from server: ' + msg);

	div.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' +
		(performance.now() / 1000).toFixed(3) +
		' --> Message from server: </p>');
	div.insertAdjacentHTML( 'beforeEnd', '<p style="color:blue">' +
		msg + '</p>');

	div.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' +
		(performance.now() / 1000).toFixed(3) +
		' --> Message from server: </p>');
	div.insertAdjacentHTML( 'beforeEnd', '<p style="color:blue">' +
		msg + '</p>');
});
/*
//Handle 'broadcast: joined' message
socket.on('broadcast: joined', function (msg){

	div.insertAdjacentHTML( 'beforeEnd', '<p class="remote">' +
		msg + '</p><br>');
    
    // Start chatting with remote peer:
	// 1. Get user's message
	var myMessage = prompt('Inserte el mensaje que quiere enviar', "");

	// 2. Send to remote peer (through server)
	socket.emit('message', {
		channel: channel,
		message: myMessage});
});
*/

//Handle remote logging message from server
socket.on('log', function (array){
	console.log.apply(console, array);
});

//Handle 'message' message
socket.on('message', function (message){
	console.log('Got message from other peer: ' + message);

	div.insertAdjacentHTML( 'beforeEnd', '<p class="remote">' +
		message + '</p><br>');
});

/*
//Handle 'response' message
socket.on('response', function (response){
	console.log('Got response from other peer: ' + response);

	div.insertAdjacentHTML( 'beforeEnd', '<p class="remote">' +
		response + '</p>');

	// Keep on chatting
	var chatMessage = prompt('Keep on chatting. Write "Bye" to quit conversation', "");

	// User wants to quit conversation: send 'Bye' to remote party
	if(chatMessage == "Bye"){
		div.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' +
			(performance.now() / 1000).toFixed(3) +
			' --> Sending "Bye" to server...</p>');
		console.log('Sending "Bye" to server');

		socket.emit('Bye', channel);

		div.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' +
			(performance.now() / 1000).toFixed(3) +
			' --> Going to disconnect...</p>');
		console.log('Going to disconnect...');

		// Disconnect from server
		socket.disconnect();
	}else{
		// Keep on going: send response back to remote party (through server)
		socket.emit('response', {
			channel: channel,
			message: chatMessage});
	}
});
*/

//Handle 'Bye' message
socket.on('Bye', function (){
	console.log('Got "Bye" from other peer! Going to disconnect...');

	div.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' +
		(performance.now() / 1000).toFixed(3) +
		' --> Got "Bye" from other peer!</p>');

	div.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' +
		(performance.now() / 1000).toFixed(3) +
		' --> Sending "Ack" to server</p>');

	// Send 'Ack' back to remote party (through server)
	console.log('Sending "Ack" to server');

	socket.emit('Ack');

	// Disconnect from server
	div.insertAdjacentHTML( 'beforeEnd', '<p>Time: ' +
		(performance.now() / 1000).toFixed(3) +
		' --> Going to disconnect...</p>');
	console.log('Going to disconnect...');

	socket.disconnect();
});