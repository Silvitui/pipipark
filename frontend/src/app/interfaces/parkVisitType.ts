import { Dog } from "./dog.interface";

export interface ParkVisitType {
    user: {
      _id: string;
      name: string;
    };
    dogs: Dog[];
  }
  