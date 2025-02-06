import express, { Request, Response } from 'express';
import 'dotenv/config';
import process from 'process';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { DBconnection } from './DB/connection';
import { options } from './utils/config/cors';
import authRouter from './routes/auth.routes';
import dogsRouter from './routes/dogs.routes';
import usersRouter from './routes/user.routes';
import authMiddleware from './middlewares/authMiddlewares';
import parksRouter from './routes/park.routes';
import statsRouter from './routes/statistics.routes';

const app = express();
const PORT = +(process.env.PORT ?? 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(options));
app.use(morgan('dev'));

app.use("/api/auth", authRouter);
app.use("/api/dogs",authMiddleware, dogsRouter);
app.use("/api/users",authMiddleware, usersRouter)
app.use("/api/parks",authMiddleware,parksRouter)
app.use("/api/stats",authMiddleware,statsRouter)



app.get('/', (_req: Request, res: Response) => {
    res.send('🐶 Bienvenido a PIPIPARK! 🐾🎈🌸🥰');
});

// Servidor y conexión a DB
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
    DBconnection();
});
