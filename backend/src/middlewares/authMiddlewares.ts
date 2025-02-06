import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import process from 'process';
import { AuthenticatedRequest } from '../utils/types/types';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken; // leer el token desde las cookies
    const secret = process.env.JWT_SECRET as string;

    if (!token) {
        res.status(401).json({error: "No autorizado, inicie sesión"});
        return;
    }

    try {
        const decoded = jwt.verify(token,secret);
        req.user = decoded as JwtPayload; // Guardamos los datos del usuario en "req.user" Jwpayload
        next();
        return;
    } catch (error) {
        res.status(403).json({error: "Token inválido, inicie sesión de nuevo"});
        return;
    }
};

export default authMiddleware;