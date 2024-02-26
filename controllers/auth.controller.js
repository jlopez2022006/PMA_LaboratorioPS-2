const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: "El correo no está registrado."
            });
        }
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: "El usuario no está activo en la base de datos."
            });
        }
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }
        const token = await generarJWT( usuario.id );
        res.json({
            msg: "Bienvenido!",
            correo, password,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Comuníquese con el administrador"
        });
    }
}

module.exports = {
    login
}