import { Types } from 'mongoose';

export interface User {
    _id: Types.ObjectId;
    userName: string;
}

export interface Dog {
    _id: Types.ObjectId;
    name: string;
    breed: string;
    size: string;
    personality: string[];
    photo: string;
}
export interface ParkVisitType {
    _id: Types.ObjectId;
    park: Types.ObjectId;
    user: Types.ObjectId | User; 
    dogs: Types.ObjectId[] | Dog[];
}

