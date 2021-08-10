
//  extraemos las herramientas de express validator
const { response } = require('express');
const { validationResult } = require('express-validator');


const validarCampos = (req, res = response, next) => {

    // manejo de errores
    const errors = validationResult( req ); // le mandamos el request
    
    // hacemos la validacion si esta vacio y mandamos el status code
    if ( !errors.isEmpty() ) { //si error no esta vacio
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }


    next(); // lo que llamamos para que haga lo siguente que tiene que hacer
}

module.exports = {
    validarCampos
}

