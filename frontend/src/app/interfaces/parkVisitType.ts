import { Dog } from "./dog.interface";

export interface ParkVisitType {
    user: {
      _id: string;
      name: string;
    };
    dogs: Dog[];
  }
  export interface VisitResponse {
    _id: string;
    park: string;
    user: string;
    dogs: string[]; 
    checkedInAt: string;
    expiresAt?: string;
  }