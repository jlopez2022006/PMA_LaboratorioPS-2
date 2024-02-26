const Rol = require('../models/role');
const Usuario = require('../models/usuario');
const Curso = require('../models/curso');
const asignarCurso = require('../models/asignarCurso');


const esRoleValido = async( rol = '' ) => {
    const existeRol = await Rol.findOne( { rol } );
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no existe en la base de datos`);
    }

}

const existeEmail = async( correo = '' ) => {
    const existeEmail = await Usuario.findOne( { correo } );
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado`);
    }

}

const existeCurso = async (nombreCurso = '') => {
    const existeCurso = await Curso.findOne({nombreCurso});
    if(existeCurso){
        throw new Error (`El curso ${nombreCurso} ya esta registrado`);
    }
}

const existeCursoAsignado = async (nombreCurso = '') => {
    const existeCurso = await asignarCurso.findOne({nombreCurso});
    if(existeCurso){
        throw new Error (`El curso ${nombreCurso} ya fue asignado`);
    }
}

const existeCursoById = async (id = '') => {
    const existeCursoId = await Curso.findOne({id});
    if(existeCursoId){
        throw  new Error(`El curso con el ${ id } no existe`);
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUser = await Usuario.findById(id);
    if ( !existeUser ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }
}



module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCursoById,
    existeCurso,
    existeCursoAsignado
}