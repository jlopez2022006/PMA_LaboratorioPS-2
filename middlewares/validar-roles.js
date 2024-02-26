const { request, response } = require('express');

const tieneRole = ( ...rol ) => {
    return (req = request, res= response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!rol.includes( req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${ rol }`
            })

        }
        next();
    }
}


module.exports = {
    tieneRole
}