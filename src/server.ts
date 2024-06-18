import express from 'express'
import router from './router'
import db from './config/db'
import colors from 'colors'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'

//instancia de express
const server = express()

//permitir conexiones cors
const corsOptions: CorsOptions = {
    origin: function(origin, callback){
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)
        } else{
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

//leer datos del formulario Thunder
server.use(express.json())

//morgan para loggear todas las peticiones hechas a la API
server.use(morgan('dev'))

//conexion con router
server.use('/api/products', router)

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.bgGreen.bold('Conexion exitosa la DB'))
    } catch (error) {
        //console.log(error)
        console.log(colors.red.bold('hubo un error al conectar a la DB'))
    }
}

connectDB()

/* server.get('/api', (req, res) => {
    res.json({msg: 'Desde API'})
}) */

//Documentacion de la API
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOptions))

export default server