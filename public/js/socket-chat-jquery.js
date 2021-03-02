var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre')
var sala = params.get('sala')

// Jquery references
var divUsuarios = $('#divUsuarios')
var formEnviar = $('#formEnviar')
var txtMensaje = $('#txtMensaje')
var divChatbox = $('#divChatbox')
var divChatTitle = $('#divChatTitle')

function renderizarUsuarios (personas) {
    console.log(personas)

    var html = ''

    html += '<li>'
    html += '    <a href="javascript:void(0)" class="active"> Chat <span>' + params.get('sala') + '</span></a>'
    html += '</li>'

    for( var i = 0; i < personas.length; i++ ){
        html += '<li>'
        switch (personas[i].estado) {
            case 'online':
                html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">' + personas[i].estado + '</small></span></a>'
                break;
            case 'busy':
                html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-warning">' + personas[i].estado + '</small></span></a>'
                break;
            case 'offline':
                html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-danger">' + personas[i].estado + '</small></span></a>'
                break;
            default:
                html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-danger">Unknown</small></span></a>'
                break;
        }
              
        html += '</li>'
    }

    divUsuarios.html(html)
}

function renderizarMensajes( mensaje, yo ) {

    var html = ''
    var fecha = new Date(mensaje.fecha)
    var hora = fecha.getHours() + ':' + minutes_with_leading_zeros(fecha)

    if ( yo ){
        html += '<li class="reverse">'
        html += '    <div class="chat-content">'
        html += '        <h5>' + mensaje.nombre + '</h5>'
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } else if (mensaje.nombre === 'Administrador1') {
        html += '<li>'
        html += '    <div class="chat-content">'
        html += '        <div class="box bg-light-success">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } else if (mensaje.nombre === 'Administrador2') {
        html += '<li>'
        html += '    <div class="chat-content">'
        html += '        <div class="box bg-light-danger">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } else {
        html += '<li>'
        html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        html += '    <div class="chat-content">'
        html += '        <h5>' + mensaje.nombre + '</h5>'
        html += '        <div class="box bg-light-info">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } 
    
    divChatbox.append(html)
}

function renderizarTitulo(){
    var html = ''

    html += '<div class="chat-main-header">'
    html += '    <div class="p-20 b-b">'
    html += '        <h3 class="box-title">Chat room <small>' + params.get('sala') + '</small></h3>'
    html += '    </div>'
    html += '</div>'

    divChatTitle.html(html)
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function minutes_with_leading_zeros(dt) 
{ 
    return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
}

// Listeners
divUsuarios.on('click', 'a', function(){

    var id = $(this).data('id')

    if ( id ) {
        socket.emit('cambiarEstado', id, function(personas){
            renderizarUsuarios(personas)
        })
        
        // var a=$('a[data-id="'+id+'"]')
        // a.attr('text-success', 'offline')
        // console.log(a)
        
        // divUsuarios.append(a.innerHTML())
    }

})

formEnviar.on('submit', function(e){

    e.preventDefault()

    if(txtMensaje.val().trim() === 0){
        return
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus()
        renderizarMensajes(mensaje, true)
        scrollBottom()
    });

})