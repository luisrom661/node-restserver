const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const confirmarEstado = {state: true}

    if (isNaN(limit) || isNaN(from)) {
        res.status(400).json({ error: 'No es un número.' })
    }

    const [total, users] = await Promise.all([
        User.countDocuments(confirmarEstado),
        User.find(confirmarEstado)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        users
    });
}

const usuariosPut = async (req, res = response) => {
    const id = req.params.id;
    const { _id, password, google, email, ...resto } = req.body;
    if (password) {
        //Encriptar (Hash) de la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto, { new: true });
    res.status(201).json(user);
}

const usuariosPost = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    //Encriptar (Hash) de la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //Guardar en la db
    await user.save();

    res.status(201).json({
        user
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;
    
    //Borrar físiciamente
    //const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, {state: false}, { new: true });

    res.json({
        user
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}