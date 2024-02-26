const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');


const Usuario = require('../models/usuario');
const Curso = require('../models/curso');

const { existeCursoAsignado } = require('../helpers/db-validators');
const { getAsignarCursoById, postAsignarCurso } = require('../controllers/asignarCurso.controller');

const router = Router();

router.get('/:idEstudiante', [
    check('idEstudiante', 'No es un ID válido').isMongoId(),
    validarCampos
], getAsignarCursoById);

router.post('/agregar', [
    validarJWT,
    tieneRole('STUDENT_ROLE'),
    check("idCurso").custom(async (value) => {
        const cursoExistente = await Curso.findOne({ _id: value });
        if (!cursoExistente) {
            throw new Error("El curso no existe en la base de datos");
        }
        return true;
    }),
    check("idEstudiante").custom(async (value) => {
        const idEstudianteExistente = await Usuario.findOne({ _id: value });
        if (!idEstudianteExistente) {
            throw new Error("El id del alumno no existe en la base de datos");
        }
        return true;
    }),
    check("fechaAsignacion").optional().isISO8601().toDate().withMessage('Fecha de asignación no válida'),
    check("nombreCurso").custom(existeCursoAsignado),
    validarCampos,
], postAsignarCurso);



module.exports = router;