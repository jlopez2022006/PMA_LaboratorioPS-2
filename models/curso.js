const { Schema, model } = require('mongoose');

const cursoSchema = Schema({
    nombreCurso: {
        type: String,
        required: [true, 'El nombre del curso es obligatorio' ],
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción debe ser obligatoria'],
    },
    duracion: {
        type: Schema.Types.Mixed,
        default: 0,
    },
    idMaestro:{
        type: String
    },
    nombreMaestro:{
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
});


module.exports = model('Curso', cursoSchema);