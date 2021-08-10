const { response } = require('express');
const Evento = require('../models/Evento'); // exportacion por evento este es mi modelo Evento o mi pojo


//CRUD


const getEventos = async( req, res = response ) => {


    // encontrar todos los eventos, populate referencia que quiero devolver, el id siempre va a venir en el populate
    const eventos = await Evento.find().populate('user','name'); // encontrar en el cuerpo de mi evento el nombre y el usuario

    // mi respuesa devuelta en json
    res.json({
        ok: true,
        eventos // me regresa el user y name encontrados en la db
    });
}

// cada metodo es una funcion que manda un req y response
const crearEvento = async ( req, res = response ) => {

    // creamos un eevento y le mandamos  el cuerpo del evento  que  es la informacion que mandamos desde el front
    const evento = new Evento( req.body ); 

    // validar que la informacion se encuentre completa antes de guardar en la base de datos
    try {


        //sacamos el id de la request y lo guardamos en el usuario del evento
        evento.user = req.uid;
        
        const eventoGuardado = await evento.save(); // tarea asincrona, ponemos el await y el async al principio de la funcion
// si todo sale bien , devolvemos el json con el evento que se guardo
        res.json({
            ok: true,
            evento: eventoGuardado
        })


    } catch (error) { // respuesta al error
        console.log(error)
        res.status(500).json({ // devolvemos status code
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


// servicio de acutalizacion
const actualizarEvento = async( req, res = response ) => {
    

    // primero tomar el id del evento que viene  en el request
    const eventoId = req.params.id;
    //
    const uid = req.uid;

    try {

        //encontrar evento por id
        const evento = await Evento.findById( eventoId ); //asincrono

        // verificar si existe en la base de datos
        if ( !evento ) {
            return res.status(404).json({ // cuando no existe 
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        // verificar si el usuario es diferente al uid, significa que es una persona que quiere editar el evento deotra persona
        if ( evento.user.toString() !== uid ) {// extreaemo el string del id
            return res.status(401).json({ // unauthorized
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } ); // new retorna los datso actualikzados


        // una vez actualizado en la base de datos
        res.json({
            ok: true,
            evento: eventoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


// servicio eliminar
const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;// recogemos el id del evento enviado en el request
    const uid = req.uid; // recogemos el id del user


// primero validaciones que son asincronas

    try {
// primero encontrar evento por id
        const evento = await Evento.findById( eventoId ); // asincrono

        if ( !evento ) { // si no hay id en el evento 
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id' // no existe
            });
        }

        if ( evento.user.toString() !== uid ) {// si el id del user en el request no es el mismo que el user de otro usuario
            return res.status(401).json({ // unauthorized
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

// cumpliendose las validaciones  llamamos el delete, metodo de express (framework)
        await Evento.findByIdAndDelete( eventoId );

        // si todo sale bien, retorna true
        res.json({ ok: true });

        
    } catch (error) { // si no se puede borrar
        console.log(error); // imprima el error
        res.status(500).json({ // error interno
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}