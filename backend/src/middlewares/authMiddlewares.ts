import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JwtUserPayload, AuthenticatedRequest } from '../utils/types/types';
import User from '../models/User';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET as string;

  if (!token) {
    res.status(401).json({ authenticated: false, error: "No autorizado, inicie sesión" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;

    const user = await User.findById(decoded.id).populate('dogs');
    if (!user) {
     res.status(401).json({ authenticated: false, error: "Usuario no encontrado" });
     return
    }

    (req as AuthenticatedRequest).user = {
      id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      dogs: user.dogs,
    } as JwtUserPayload;
    next();
  } catch (error) {
    res.status(403).json({ authenticated: false, error: "Token inválido, inicie sesión de nuevo" });
    return;
  }
};

export default authMiddleware;
