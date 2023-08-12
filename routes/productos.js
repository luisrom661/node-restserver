const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminRole, validarRole } = require('../middlewares/validar-roles');

const { 
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos')

const {
    esRolValido,
    existeProductoPorId,
    existeCategoriaPorId
} = require('../helpers/db-validators');

const router = Router();

// Obtener todos los productos - público
router.get('/', obtenerProductos)

// Obtener una producto por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProductoPorId)

// Crear una producto - privado - cualquier rol
router.post('/', [ 
    validarJWT,
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('category', 'No es un ID válido').isMongoId().bail(),
    check('category').custom(existeCategoriaPorId),
    validarCampos
 ], crearProducto )

// Actualizar - privado - cualquier rol
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeProductoPorId),
    check('role').optional().custom(esRolValido),
    validarCampos
], actualizarProducto)

// Borrar - privado - admin
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    validarRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)

module.exports = router;