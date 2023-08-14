const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarArchivo } = require('../middlewares/validar-archivo');
const { cargarArchivo, mostrarImagenCloudinary, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators')

const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El ID debe de ser de MongoDB').isMongoId().bail(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'producto'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El ID debe de ser de MongoDB').isMongoId().bail(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'producto'])),
    validarCampos
], mostrarImagenCloudinary)

module.exports = router;