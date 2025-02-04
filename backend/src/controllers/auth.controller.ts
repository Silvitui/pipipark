import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Dog from '../models/Dog';


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password, dogs } = req.body;

        if (!userName || !email || !password || !dogs || !Array.isArray(dogs) || dogs.length === 0) {
            return res.status(400).json({ error: "Debes registrar al menos un perro." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El email ya está registrado. Usa otro." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userName, email, password: hashedPassword });


        const dogPromises = dogs.map(dogData => new Dog({ //mapeamos cada perro y lo guardamos en un array
            gender: dogData.gender,
            age: dogData.age,
            breed: dogData.breed,
            name: dogData.name,
            size: dogData.size,
            personality: dogData.personality,
            photo: dogData.photo || "https://via.placeholder.com/150",
            owner: newUser._id
        }));
        const savedDogs = await Dog.insertMany(dogPromises);
        newUser.dogs = savedDogs.map(dog => dog._id); // Extraigo los id de los perros guardados y los asigno al usuario
        await newUser.save();

        return res.status(201).json({ 
            message: "Usuario y perros registrados correctamente", 
            user: newUser, 
            dogs: savedDogs 
        });
    } catch (error) {
        console.error("Error en registerUser:", error);
        return res.status(500).json({ message: "Error al registrar usuario y perros" });
    }
};
