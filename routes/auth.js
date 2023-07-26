const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio.').isEmail(),
    check('password', 'la contraseña es obligatoria.').not().isEmpty(),
    validarCampos
],login);

router.post('/google', [
    check('id_token', 'El ID Token es necesario.').not().isEmpty(),
    validarCampos
],googleSignIn);

module.exports = router;