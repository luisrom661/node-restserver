const path = require('path')
const { v4: uuidv4 } = require('uuid');

const { response } = require("express");

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        // Validar que exista el archivo

        const nombreSeparadoArchivo = archivo.name.split('.');
        const extensionArchivo = nombreSeparadoArchivo[nombreSeparadoArchivo.length - 1];

        // Validar la extensión

        if (!extensionesValidas.includes(extensionArchivo)) {
            return reject(`La extensión ${extensionArchivo} no es permitida, deben ser: ${extensionesValidas}`);
        }

        const nombreTemporal = uuidv4() + '.' + extensionArchivo;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemporal);
        });
    });
}

module.exports = {
    subirArchivo
}