const { Schema, model } = require('mongoose');

const asignarCursoSchema = Schema({
    idCurso: {
        type: String,
        required: [true, 'El id del curso es obligatorio' ],
    },
    nombreCurso: {
        type: String,
        required: [true, 'El nombre del curso es obligatorio' ],
    },
    fechaAsignacion: {
        type: Date,
        default: Date.now,
    },
    idEstudiante:{
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
});

asignarCursoSchema.methods.toJSON = function(){
    const{ __v, _id, idCurso, ...asignarCurso} = this.toObject();
    asignarCurso.uid = _id;
    return asignarCurso;
};


module.exports = model('asignarCurso', asignarCursoSchema);