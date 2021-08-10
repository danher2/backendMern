/*
    Event Routes rutas para poner en el postman y probar
    /api/events
*/
const { Router } = require('express'); //para manejar nuestros router
const { check } = require('express-validator'); // en cada peticion 

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router = Router();

// Todas las  peticiones tienen que pasar por la validación del JWT
router.use( validarJWT );


// Obtener eventos 
router.get('/', getEventos );

// Crear un nuevo evento
router.post(
    '/',
    [    //hacemos las validaciones para los campos al crear un evento
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos // middleware que tengo que llamar despues de todos los checks
    ],
    crearEvento 
);

// Actualizar Evento
router.put(
    '/:id',  // id  se le da el id que tenga el usuario, es como en java que se le manda el id
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento  // llamamos el metodo
);

// Borrar evento
router.delete('/:id', eliminarEvento );  // establecemos la ruta y el metodo

module.exports = router;