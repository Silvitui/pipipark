import mongoose from "mongoose";
import 'dotenv/config';

const mongoDBURI = process.env.MONGO_DB_URI ?? '';

export const DBconnection = async () => {
    try {
        await mongoose.connect(mongoDBURI as string);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        process.exit(1); 
    }
};
