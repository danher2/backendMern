const moment = require('moment');




const isDate = ( value ) => {

    if ( !value ) { // si el value no existe, el campo no es correcto
        return false;
    }

    const fecha = moment( value );
    if ( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }
    
}



module.exports = { isDate };


