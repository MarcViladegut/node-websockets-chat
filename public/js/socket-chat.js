var socket = io();

var params = new URLSearchParams( window.location.search )
if(!params.has('nombre')){
    window.location = 'index.html'
    throw new Error('The name is mandatory')
}

var usuario = {
    nombre: params.get('nombre')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp){
        console.log('Usuarios conectados', resp)
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Send information 
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Notify when some user is disconnected from the server
socket.on('listaPersona', function(personas) {

    console.log(personas);

});

// Private message
socket.on('mensajePrivado', function(mensaje){
    console.log('mensaje privado:', mensaje)
})