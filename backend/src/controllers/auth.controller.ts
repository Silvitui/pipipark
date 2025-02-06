import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Dog from '../models/Dog';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password, dogs } = req.body;
        if (!userName || !email || !password || !dogs || !Array.isArray(dogs) || dogs.length === 0) {
            res.status(400).json({ error: "Debes registrar al menos un perro." });
            return 
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "El email ya está registrado. Usa otro." });
            return 
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userName, email, password: hashedPassword });
        const dogPromises = dogs.map(dogData => new Dog({
            gender: dogData.gender,
            age: dogData.age,
            breed: dogData.breed,
            name: dogData.name,
            size: dogData.size,
            personality: dogData.personality,
            photo: dogData.photo ,
            owner: newUser._id
        }));
        const savedDogs = await Dog.insertMany(dogPromises);
        newUser.dogs = savedDogs.map(dog => dog._id);
        await newUser.save();

        res.status(201).json({ 
            message: "Usuario y perros registrados correctamente", 
            user: newUser, 
            dogs: savedDogs 
        });
        return 
    } catch (error) {
        console.error("Error en registerUser:", error);
        res.status(500).json({ message: "Error al registrar usuario y perros" });
        return 
    }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email y contraseña son obligatorios" });
            return 
        }

        const user = await User.findOne({ email }).populate('dogs');
        if (!user) {
            res.status(400).json({ error: "Usuario no encontrado" });
            return 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Contraseña incorrecta" });
            return 
        }

 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        // 🔥 Guardar el token en una cookie segura
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.status(200).json({ 
            message: "Inicio de sesión exitoso", 
            user: { _id: user._id, userName: user.userName, dogs: user.dogs } 
        });
        return 
    } catch (error) {
        console.error("Error en loginUser:", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
        return 
    }
};

// 🔥 LOGOUT DE USUARIO
export const logoutUser = (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Sesión cerrada correctamente" });
    return 
};
