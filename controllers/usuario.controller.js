const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {
    const query = { estado: true };
    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {
    const { nombre, correo, edad, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, edad, password, rol });
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    res.json({
        msg: 'Usuario Creado exitosamente',
        usuario
    });

}


const putUsuario = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id, img, estado, rol, google, ...resto } = req.body;
        if (resto.password) {
            const salt = bcrypt.genSaltSync();
            resto.password = bcrypt.hashSync(resto.password, salt);
        }
        const usuarioEditado = await Usuario.findOneAndUpdate({ _id: id }, resto, { new: true });
        res.json({
            msg: 'Alumno actualizado exitosamente',
            usuarioEditado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor',
        });
    }
};

const deleteUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json({
        msg: 'Alumno eliminado exitosamente',
        usuarioEliminado
    });
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
}