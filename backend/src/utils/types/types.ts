import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: jwt.JwtPayload;
}

// AuthenticatedRequest es un tipo personalizado de typescript que extiende Request para incluir información del usuario autenticado.