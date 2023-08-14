const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino ); // True

    if (esMongoID) {
        const usuario = await User.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ) 

    const usuarios = await User.find({ 
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: usuarios
    })

}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino ); // True

    if (esMongoID) {
        const categoria = await Category.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ) 

    const categorias = await Category.find({ 
        $or: [{ name: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: categorias
    })
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino ); // True

    if (esMongoID) {
        const producto = await Product.findById(termino).populate('category', 'name');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ) 

    const productos = await Product.find({ 
        $or: [{ name: regex }],
        $and: [{ state: true }]
    }).populate('category', 'name');

    res.json({
        results: productos
    })
}

const buscar = (req, res = response ) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'No ha buscado o se le olvidó buscar.'
            })
            break;
    }
}

module.exports = {
    buscar
}
