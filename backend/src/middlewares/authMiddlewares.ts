import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import process from 'process';
import { AuthenticatedRequest } from '../utils/types/types';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken; //  Leer el token desde las cookies
    const secret = process.env.JWT_SECRET as string;

    if (!token) {
        res.status(401).json({ authenticated: false, error: "No autorizado, inicie sesión" });
        return 
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded as JwtPayload; //  Guardar los datos del usuario en `req.user`
        return next();
    } catch (error) {
        res.status(403).json({ authenticated: false, error: "Token inválido, inicie sesión de nuevo" });
        return 
    }
};

export default authMiddleware;

