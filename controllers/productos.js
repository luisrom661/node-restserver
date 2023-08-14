const { response } = require("express");
const Product = require('../models/product');

const obtenerProductos = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const confirmarEstado = { state: true };

    if (isNaN(limit) || isNaN(from)) {
        res.status(400).json({ error: 'No es un número.' })
    }

    const [total, products] = await Promise.all([
        Product.countDocuments(confirmarEstado),
        Product.find(confirmarEstado)
                .populate('user', 'name')
                .populate('category', 'name')
                .skip(Number(from))
                .limit(Number(limit))
    ])

    res.json({
        total,
        products
    })
}

const obtenerProductoPorId = async( req, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
                                    .populate('user', 'name')
                                    .populate('category', 'name');

    res.json({
        product
    })
}

const crearProducto = async(req, res = response) => {
    const {state, user, ...body} = req.body;

    const productDB = await Product.findOne({ name: body.name });
    
    if (productDB) {
        return res.status(400).json({
            msg: `El producto ${ productDB.name }, ya existe.`
        });
    }
    
    //Generar la data de guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }
    
    const product = await Product( data );
    
    //Guardar en la DB
    await product.save();
    
    res.status(201).json(product)
}

const actualizarProducto = async(req, res = response) => {
    const id = req.params.id;
    const { state, user, ...resto} = req.body;

    if (resto.name) {
        resto.name = resto.name.toUpperCase();
    }

    resto.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(product);
}

const borrarProducto = async(req, res = response) => {
    const { id } = req.params;
    
    //Borrar físiciamente
    //const user = await User.findByIdAndDelete(id);

    const product = await Product.findByIdAndUpdate(id, {state: false}, { new: true });

    res.json({
        product
    });
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    borrarProducto
}
