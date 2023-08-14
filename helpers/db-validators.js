const Category = require('../models/category');
const Role = require('../models/role');
const User = require('../models/user');
const Product = require('../models/product');

const esRolValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${role} no está registrado en la base de datos.`);
    }
}

const emailExiste = async (email = '') => {
    //Verficiar si el correo existe
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El correo: ${email} ya está registrado.`);
    }
}

const existeUsuarioPorId = async (id) => {
    
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`El ID no existe: ${id}`);
    }
}

const existeCategoriaPorId = async (id) => {
    
    const existeCategoria = await Category.findById(id);

    if (!existeCategoria) {
        throw new Error(`El ID no existe: ${id}`);
    }
}

const existeProductoPorId = async (id) => {
    
    const existeProducto = await Product.findById(id);

    if (!existeProducto) {
        throw new Error(`El ID no existe: ${id}`);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const coleccionIncluida = colecciones.includes(coleccion);
    if (!coleccionIncluida) {
        throw new Error(`La colección ${coleccion} no es permitida: ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}