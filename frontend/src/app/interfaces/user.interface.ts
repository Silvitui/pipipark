import { Dog } from "./dog.interface";

export interface User {
  _id: string;
  userName: string;
  email: string;
  dogs: Dog[];
}
