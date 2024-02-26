const { response, request } = require('express');
const Curso = require('../models/curso');
const Usuario = require('../models/usuario');
const asignarCurso = require('../models/asignarCurso');

const postCurso = async (req, res) => {
    try {
        const { nombreCurso, idMaestro, duracion, descripcion } = req.body;
        const maestro = await Usuario.findById(idMaestro);
        if (!maestro) {
            return res.status(400).json({
                msg: 'El maestro con el ID proporcionado no existe',
            });
        }
        const curso = new Curso({ nombreCurso, idMaestro, duracion, descripcion });
        await curso.save();
        res.status(202).json({
            msg: 'Curso guardado exitosamente',
            curso: {
                nombreMaestro: maestro.nombre, 
                ...curso.toObject(),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor',
        });
    }
};

const getCurso = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, curso] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        curso
    });
}

const getCursoById = async (req, res) => {
    try {
        const { idMaestro } = req.params;
        const cursos = await Curso.find({ idMaestro, estado: true });
        res.status(200).json({
            cursos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor',
        });
    }
};


const putCurso = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombreCurso, ...resto } = req.body;
        const cursoEditado = await Curso.findByIdAndUpdate(id, { nombreCurso, ...resto }, { new: true });
        await asignarCurso.updateMany({ idCurso: id }, { nombreCurso });
        res.json({
            msg: 'Curso editado exitosamente',
            cursoEditado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor',
        });
    }
};

const deleteCurso = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const cursoEliminado = await Curso.findById(id);
        if (!cursoEliminado) {
            return res.status(404).json({
                msg: 'Curso no encontrado',
            });
        }
        cursoEliminado.estado = false;
        await cursoEliminado.save();
        await asignarCurso.deleteMany({ nombreCurso: cursoEliminado.nombreCurso });
        res.json({
            msg: 'Curso eliminado exitosamente',
            cursoEliminado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor',
        });
    }
};

module.exports = {
    getCursoById,
    postCurso,
    putCurso,
    deleteCurso,
    getCurso
}