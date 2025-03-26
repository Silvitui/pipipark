import { Types } from 'mongoose';

// Usuario básico
export interface User {
  _id: Types.ObjectId;
  userName: string;
}

// Perro básico
export interface Dog {
  _id: Types.ObjectId;
  name: string;
  breed: string;
  size: string;
  personality: string[];
  photo: string;
}

// Visita a un parque
export interface ParkVisitType {
  _id: Types.ObjectId;
  park: Types.ObjectId;
  user: Types.ObjectId | User; 
  dogs: (Types.ObjectId | Dog)[]; 
}
