const { Router } = require('express');
const { check } = require('express-validator');
const { postCurso, putCurso, deleteCurso, getCursoById, getCurso } = require('../controllers/curso.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');

const Usuario = require('../models/usuario');
const { existeCurso } = require('../helpers/db-validators');

const isStringOrNumber = (value) => {
    return typeof value === 'number' || typeof value === 'string';
};

const router = Router();

router.get("/", getCurso);


router.get('/idDelMaestro/:idMaestro', [
    check('idMaestro', 'No es un ID válido').isMongoId(),
    validarCampos
], getCursoById);

router.post('/agregar', [
    validarJWT,
    tieneRole('TEACHER_ROLE'),
    check("nombreCurso", "Nombre no puede estar vacio").not().isEmpty(),
    check("idMaestro").custom(async (value) => {
        const idmaestroExistente = await Usuario.findOne({ _id: value });
        if (!idmaestroExistente) {
            throw new Error("El id del maestro no existe en la base de datos");
        }
        return true;
    }),
    check("descripcion", "la descripcion no puede estar vacio").not().isEmpty(),
    check("duracion").optional().custom(isStringOrNumber).withMessage('La duración debe ser texto o un número'),
    check("nombreCurso").custom(existeCurso),
    validarCampos,
], postCurso);

router.put('/idCurso/:id', [
    validarJWT,
    tieneRole('TEACHER_ROLE'),
], putCurso);

router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('TEACHER_ROLE'),
], deleteCurso);

module.exports = router;