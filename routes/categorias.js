const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminRole, validarRole } = require('../middlewares/validar-roles');

const { 
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');

const {
    esRolValido,
    existeCategoriaPorId
} = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - público
router.get('/', obtenerCategorias)

// Obtener una categoria por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoriaPorId)

// Crear una categoria - privado - cualquier rol
router.post('/', [ 
    validarJWT,
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    validarCampos
 ], crearCategoria )

// Actualizar - privado - cualquier rol
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeCategoriaPorId),
    check('role').optional().custom(esRolValido),
    validarCampos
], actualizarCategoria)

// Borrar - privado - admin
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    validarRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria)

module.exports = router;