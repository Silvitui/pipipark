// utils/types/types.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtUserPayload;
}

// AuthenticatedRequest es un tipo personalizado de typescript que extiende Request para incluir información del usuario autenticado.