import express, { Request, Response } from 'express';
import 'dotenv/config';
import process from 'process';
import cors from 'cors';
import path from 'path';
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
import pipicanRouter from './routes/pipican.routes';
import compatibilityRoutes from './routes/compatibility.routes';

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
app.use('/api/pipicans',authMiddleware, pipicanRouter);
app.use('/api/compatibility', authMiddleware, compatibilityRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use('/uploads', express.static('uploads'));



app.get('/', (_req: Request, res: Response) => {
    res.send('🐶 Bienvenido a CONNECTAPET! 🐾🎈🌸🥰');
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
    DBconnection();
});
