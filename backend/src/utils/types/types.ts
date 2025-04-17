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

export interface DogType {
  _id: string;
  name: string;
  gender: 'macho' | 'hembra';
  breed: string;
  birthday: Date;
  size: 'pequeño' | 'mediano' | 'grande';
  owner: string; // o `UserType` si tienes uno
  castrated: boolean;
  personality: string[];
  photo?: string;
}
