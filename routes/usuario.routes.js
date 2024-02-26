const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuario.controller');
const { esRoleValido, existeUsuarioPorId, existeEmail } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();
const isStringOrNumber = (value) => {
    return typeof value === 'number' || typeof value === 'string';
};

router.get('/mostrar', getUsuarios);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check("edad").optional().custom(isStringOrNumber).withMessage('La edad debe ser texto o un número'),
    check('correo').custom( existeEmail ),
    check('rol'),
    validarCampos,
] ,postUsuario);

router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol'),
    validarCampos
] ,putUsuario);


router.delete('/eliminar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);

module.exports = router;