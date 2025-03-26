import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JwtUserPayload, AuthenticatedRequest } from '../utils/types/types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET as string;

  if (!token) {
    res.status(401).json({ authenticated: false, error: "No autorizado, inicie sesión" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    //  Cast explícito a AuthenticatedRequest (solo para usar su estructura)
    const authReq = req as AuthenticatedRequest;
    authReq.user = decoded;

    next();
    return;
  } catch (error) {
    res.status(403).json({ authenticated: false, error: "Token inválido, inicie sesión de nuevo" });
    return;
  }
};

export default authMiddleware;
