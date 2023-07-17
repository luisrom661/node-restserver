const { Router } = require('express');
const {check} = require('express-validator');

const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch 
} = require('../controllers/usuarios');

//const {validarCampos, validarJWT, validarRole} = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, validarRole } = require('../middlewares/validar-roles');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeUsuarioPorId),
    check('role').optional().custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener 6 letras').isLength({min: 6}),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExiste),
    //check('role', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(esRolValido),
    validarCampos
],usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    validarRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId().bail(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;