import express, { Request, Response } from 'express';
import 'dotenv/config';
import process from 'process';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { DBconnection } from './DB/connection';
// import userRouter from './routes/user.routes';
// import authRouter from './routes/auth.routes';
// import calendarRouter from './routes/calendar.routes';
// import mapRouter from './routes/map.routes';
// import statsRouter from './routes/statistics.routes';
// import dogsRouter from './routes/dogs.routes';
// import authMiddleware from './middlewares/authMiddleware';
import { options } from './utils/config/cors';

const app = express();
const PORT = +(process.env.PORT ?? 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(options));
app.use(morgan('dev'));

// app.use("/api/auth", authRouter);
// app.use("/api/user", authMiddleware, userRouter);
// app.use("/api/calendar", authMiddleware, calendarRouter);
// app.use("/api/map", authMiddleware, mapRouter);
// app.use("/api/stats", authMiddleware, statsRouter);
// app.use("/api/dogs", authMiddleware, dogsRouter); 

// Ruta de prueba
app.get('/', (_req: Request, res: Response) => {
    res.send('🐶 Bienvenido a PIPIPARK! 🐾');
});

// Servidor y conexión a DB
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
    DBconnection();
});
