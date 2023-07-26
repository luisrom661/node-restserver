const Role = require('../models/role');
const User = require('../models/user');

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

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}