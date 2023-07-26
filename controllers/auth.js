const { response, request } = require("express");
const bcryptjs = require('bcryptjs')

const User = require('../models/user');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            //Tengo que crear el usuario.
            const data = {
                name,
                email,
                password: 'holi',
                img,
                google: true,
            };
            user = new User( data );
            await user.save();
        }
        
        //Si el usuario está en la DB
        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Hable con el adminsitrador, usuario bloqueado.'
            })
        }

        const token = await generarJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar.'
        })
    }

    
}

module.exports = {
    login,
    googleSignIn
} 