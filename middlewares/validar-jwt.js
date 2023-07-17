const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay un token en la petición.'
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existente en la Base de datos.'
            })
        }

        //Verificar: Si el uid tiene estado: true
        if (!user.state) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido.'
        })
    }
}

module.exports = {
    validarJWT
}