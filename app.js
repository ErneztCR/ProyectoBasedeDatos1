const express = require('express');
const { poolPromise } = require('./Conexión BD/connectionSQLServer.js');  // Importamos la conexión a la base de datos
const sql = require('mssql');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Función para generar el numero de incidencias en forma automatica
function generarNroIncidencia() {
    const fecha = new Date();
    //Se va a generar el numero de incidencia con el formato INCYYYYMMDDHHMMSS
    const nroIncidencia = 'INC' + fecha.getFullYear() + String(fecha.getMonth() + 1).padStart(2, '0') 
    + String(fecha.getDate()).padStart(2, '0') 
    + String(fecha.getMinutes()).padStart(2, '0') + String(fecha.getSeconds()).padStart(2, '0');
    return nroIncidencia;
}

//Configuracion para archivos estaticos (HTML, CSS, JS, etc.)
app.use(express.static(__dirname));

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/Paginas/PaginaInicio.html'));
});

// Ruta para la página de Ficha
app.get('/Ficha.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/Paginas/Ficha.html'));

});

// Ruta para guardar los datos de la boleta
app.post('/guardarBoleta', async (req, res) => {
    try {
        const pool = await poolPromise;
       
        const nroIncidencia = generarNroIncidencia();
        const { cliente, tecnico, fechaApertura, fechaCierre, modelo, serie, motivoServicio, 
                condicionEquipo, accionTomada, motivoLlamada, ubicacionFalla, tipoFalla,
                horaInicialViaje, horaFinalViaje, horaInicialTrabajo, horaFinalTrabajo,
                repuestos, contometroInicial, contometroFinal, opcionesServicio, medicionesVoltaje, checkList } = req.body;

        const result = await pool.request()
            .input('cliente', sql.VarChar, cliente)
            .input('tecnico', sql.VarChar, tecnico)
            .input('fechaApertura', sql.Date, fechaApertura)
            .input('fechaCierre', sql.Date, fechaCierre)
            .input('nroIncidencia', sql.NVarChar(50), nroIncidencia)
            .input('modelo', sql.VarChar, modelo)
            .input('serie', sql.VarChar, serie)
            .input('motivoServicio', sql.VarChar, motivoServicio)
            .input('condicionEquipo', sql.VarChar, condicionEquipo)
            .input('accionTomada', sql.VarChar, accionTomada)
            .input('motivoLlamada', sql.VarChar, motivoLlamada)
            .input('ubicacionFalla', sql.VarChar, ubicacionFalla)
            .input('tipoFalla', sql.VarChar, tipoFalla)
            // Usa el tipo de dato SQL adecuado: sql.Time para las horas
            .input('horaInicialViaje', sql.Time, horaInicialViaje)
            .input('horaFinalViaje', sql.Time, horaFinalViaje)
            .input('horaInicialTrabajo', sql.Time, horaInicialTrabajo)
            .input('horaFinalTrabajo', sql.Time, horaFinalTrabajo)
            .input('repuestos', sql.VarChar, repuestos)  
            .input('contometroInicial', sql.VarChar, contometroInicial)
            .input('contometroFinal', sql.VarChar, contometroFinal)
            .input('opcionesServicio', sql.VarChar, opcionesServicio)
            .input('medicionesVoltaje', sql.VarChar, medicionesVoltaje)
            .input('checkList', sql.VarChar, checkList)
            .query(`INSERT INTO Boletas (cliente, tecnico, fechaApertura, fechaCierre, nroIncidencia, modelo, serie, 
                        motivoServicio, condicionEquipo, accionTomada, motivoLlamada, ubicacionFalla, tipoFalla, 
                        horaInicialViaje, horaFinalViaje, horaInicialTrabajo, horaFinalTrabajo, repuestos, 
                        contometroInicial, contometroFinal, opcionesServicio, medicionesVoltaje, checkList) 
                    VALUES (@cliente, @tecnico, @fechaApertura, @fechaCierre, @nroIncidencia, @modelo, @serie, 
                            @motivoServicio, @condicionEquipo, @accionTomada, @motivoLlamada, @ubicacionFalla, 
                            @tipoFalla, @horaInicialViaje, @horaFinalViaje, @horaInicialTrabajo, @horaFinalTrabajo, 
                            @repuestos, @contometroInicial, @contometroFinal, @opcionesServicio, @medicionesVoltaje, 
                            @checkList)`);

        res.status(200).send('Boleta guardada exitosamente.');
    } catch (err) {
        res.status(500).send('Error al guardar la boleta: ' + err.message);
    }
});


// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
