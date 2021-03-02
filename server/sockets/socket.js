
const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios')
const {crearMensaje} = require('../utils/utils')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if(!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'The name and room is mandatory'
            })
        }

        client.join(data.sala)

        usuarios.agregarPersona(client.id, data.nombre, data.sala, 'online')

        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador1', `${data.nombre} is connected`))
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala))

        callback(usuarios.getPersonasPorSala(data.sala))

    })

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje( persona.nombre, data.mensaje )

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

        callback( mensaje )
    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona( client.id )

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador2', `${personaBorrada.nombre} is disconnected`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala))
    
    })

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id)

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    
    })

    client.on('cambiarEstado', (id, callback) => {
        let persona
        if(usuarios.getEstado(id) === 'online')
            persona = usuarios.cambiarEstado(id, 'busy')
        else
            persona = usuarios.cambiarEstado(id, 'online')
        
        client.broadcast.to(persona.sala).emit('listaPersona', usuarios.getPersonasPorSala(persona.sala))
    
        callback(usuarios.getPersonasPorSala(persona.sala))
    })

});