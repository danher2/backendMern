const { Schema, model } = require('mongoose');



// campos que tiene cada eevento, evento es un objeto en la db
const EventoSchema = Schema({ // funcion de mogoose

    //cada atributo es un objeto
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,        
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // le dice a mongoose que es una referencia a usuario
        ref: 'Usuario', // nombre del otro schema, como un ORM
        required: true // usuario obligatorio
    }

});


// como queremos que se serialice
// covertimos a json nuestro evento
EventoSchema.method('toJSON', function() {  // referencia al this
    const { __v, _id, ...object } = this.toObject(); // referencia al objeto que se esta serializando y extraemos de manera independiente la versioon y el id
    object.id = _id; // hacemos un reemplazo al object, ya no queremos que se  llama _id solo id
    return object; // hacemos retorn del objeto ya modificado
});


// exportamos nuestro modelo
module.exports = model('Evento', EventoSchema );

