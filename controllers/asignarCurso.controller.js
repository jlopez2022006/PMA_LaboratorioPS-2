const { response, request } = require('express');
const asignarCurso = require('../models/asignarCurso');
const Curso = require('../models/curso');


const postAsignarCurso = async (req, res) => {
    try {
        const { idCurso, fechaAsignacion, idEstudiante } = req.body;
        const asignacionExistente = await asignarCurso.findOne({
            idEstudiante,
            idCurso,
        });

        if (asignacionExistente) {
            return res.status(400).json({
                msg: 'El estudiante ya está asignado a este curso.',
            });
        }
        const cursosAsignados = await asignarCurso.countDocuments({ idEstudiante });
        if (cursosAsignados >= 3) {
            return res.status(400).json({
                msg: 'El estudiante ya tiene asignados 3 cursos. No se pueden asignar más.',
            });
        }
        const cursoExistente = await Curso.findById(idCurso);
        if (!cursoExistente) {
            return res.status(400).json({
                msg: 'El curso no existe en la base de datos',
            });
        }
        const nuevaAsignacion = new asignarCurso({
            idCurso,
            nombreCurso: cursoExistente.nombreCurso,
            duracion: cursoExistente.duracion,
            fechaAsignacion,
            idEstudiante,
        });
        await nuevaAsignacion.save();
        res.status(201).json({
            msg: 'Curso asignado exitosamente',
            asignacion: {
                ...nuevaAsignacion.toJSON(),
                nombreCurso: cursoExistente.nombreCurso,
                duracion: cursoExistente.duracion,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor',
        });
    }
};

const getAsignarCursoById = async (req, res) => {
    try {
        const { idEstudiante } = req.params;
        const asignar = await asignarCurso.find({ idEstudiante });
        res.status(200).json({
            asignar
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor',
        });
    }
};



module.exports = {
    getAsignarCursoById,
    postAsignarCurso,
}