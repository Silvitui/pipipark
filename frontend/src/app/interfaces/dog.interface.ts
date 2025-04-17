export interface Dog {
  _id: string;
  name: string;
  gender: string;
  breed: string;
  birthday: Date;
  size: string;
  personality: string[];
  castrated: boolean;
  photo: string;
}

export interface CompatibilityRequest {
  dog1Id: string;
  dog2Id: string;
}

export interface CompatibilityResponse {
  name: string;          // el nombre del perro comparado
  score: number;         // el porcentaje de compatibilidad
  summary?: string;      // opcional, una frase de resumen
}

