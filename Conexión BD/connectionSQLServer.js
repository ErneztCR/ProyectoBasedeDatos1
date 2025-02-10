const sql = require('mssql');

const config = {
    user: 'UsuarioSQLServer',  // usuario de SQL Server
    password: '123456',  // contraseña de SQL Server
    server: 'localhost',  // nombre o dirección IP del servidor
    database: 'BoletaServicio',  // nombre de la base de datos
    options: {
        encrypt: true,
        trustServerCertificate: true  // solo si se está trabajando en un entorno de desarrollo local
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conexión a la base de datos exitosa');
        return pool;
    })
    .catch(err => {
        console.log('Error en la conexión a la base de datos', err);
    });

module.exports = {
    sql, poolPromise
};
