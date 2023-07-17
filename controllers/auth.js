const { response } = require("express");
const bcryptjs = require('bcryptjs')

const User = require('../models/user');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        //Verificar: Si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos. -correo'
            })
        }

        //Verificar: Si el usuario está activo
        if (!user.state) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos. estado: false'
            })
        }

        //Verificar: Si la contraseña es válida
        const validarPassword = bcryptjs.compareSync(password, user.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos. -contraseña'
            })
        }

        //Hacer: generar el JWT
        const token = await generarJWT( user.id );

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador.'
        })
    }
}

module.exports = {
    login
} 