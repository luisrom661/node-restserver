const { response } = require("express");
const Category = require('../models/category');

const obtenerCategorias = async (req, res = response) => {
    const { limit = 5 , from = 0 } = req.query;
    const confirmarEstado = { state: true }

    if (isNaN(limit) || isNaN(from)) {
        res.status(400).json({ error: 'No es un número.' })
    }

    const [total, categories] = await Promise.all([
        Category.countDocuments(confirmarEstado),
        Category.find(confirmarEstado)
                .populate('user', 'name')
                .skip(Number(from))
                .limit(Number(limit))
    ])

    res.json({
        total,
        categories
    })
}
const obtenerCategoriaPorId = async (req, res = response) => {
    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    res.json({
        category
    })
}

const crearCategoria = async (req, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });
    
    if (categoryDB) {
        return res.status(400).json({
            msg: `La categoría ${ categoryDB.name }, ya existe.`
        });
    }
    
    //Generar la data de guardar
    const data = {
        name,
        user: req.user._id
    }
    
    const category = await Category( data );
    
    //Guardar en la DB
    await category.save();
    
    res.status(201).json(category)
}

const actualizarCategoria = async (req, res = response) => {
    const id = req.params.id;
    const { state, user, ...resto} = req.body;

    resto.name = resto.name.toUpperCase();
    resto.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(category);
}
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    
    //Borrar físiciamente
    //const user = await User.findByIdAndDelete(id);

    const category = await Category.findByIdAndUpdate(id, {state: false}, { new: true });

    res.json({
        category
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    borrarCategoria
}