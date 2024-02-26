const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/api/auth';
        this.usuariosPath = '/api/usuario';
        this.cursosPath = '/api/curso';
        this.asignarCursosPath = '/api/asignarCurso';

        this.conectarDB();
        this.middlewares();
        this.routes();

    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.usuariosPath, require('../routes/usuario.routes'));
        this.app.use(this.cursosPath, require('../routes/curso.routes'));
        this.app.use(this.asignarCursosPath, require('../routes/asignarCurso.routes'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        })
    }
}

module.exports = Server;