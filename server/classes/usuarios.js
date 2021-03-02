
class Usuarios {

    constructor() {
        this.personas = []
    }

    agregarPersona(id, nombre, sala, estado) {
        let persona = { id, nombre, sala, estado }

        this.personas.push(persona)

        return this.personas
    }

    getPersona( id ) {
        let persona = this.personas.filter(persona => persona.id === id)[0]
    
        return persona
    }

    getPersonas() {
        return this.personas
    }

    getPersonasPorSala( sala ) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala)

        return personasEnSala
    }

    borrarPersona( id ) {
        let personaBorrada = this.getPersona(id)

        this.personas = this.personas.filter( persona => persona.id != id)
    
        return personaBorrada
    }

    cambiarEstado( id, estado ) {
        for (var i in this.personas) {
            if(this.personas[i].id == id)
                this.personas[i].estado = estado
        }

        return this.getPersona(id)
    }

    getEstado( id ) {
        return this.getPersona(id).estado
    }

}

module.exports = {
    Usuarios
}