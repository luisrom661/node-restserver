const { response } = require("express");
const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL)

const { subirArchivo } = require("../helpers/subir-archivo");
const  Product = require('../models/product');
const  User = require("../models/user");

const cargarArchivo = async (req, res = response) => {

    try {
        // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        return res.json({
            nombre
        })
    } catch (err) {
        return res.status(400).json({ err });
    }  
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'producto':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.'})
    }

    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo)
}

const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'producto':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.'})
    }

    if (modelo.img) {
        const nombreArray = modelo.img.split('/');
        const nombre = nombreArray[ nombreArray.length - 1 ];
        const [ public_id ] = nombre.split('.');
        await cloudinary.uploader.destroy(`RestServer NodeJs/${coleccion}/${public_id}`)
    }
    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath,{folder:`RestServer NodeJs/${coleccion}`} );

    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo)
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'producto':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.'})
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg',)
    res.sendFile(pathImagen);

}

const mostrarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'producto':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.'})
    }

    if (modelo.img) {
        const pathImagen = modelo.img;
        return res.redirect(pathImagen)
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg',)
    res.sendFile(pathImagen);

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
} 