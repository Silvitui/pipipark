import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Dog from '../models/Dog';
import { AuthenticatedRequest } from '../utils/types/types';

export const registerUser = async (req: Request, res: Response) => {
    try {
      const { userName, email, password, dog } = req.body;
  
      if (!userName || !email || !password || !dog) {
        res.status(400).json({ error: "Todos los campos son obligatorios" });
        return;
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: "El email ya está registrado. Usa otro." });
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ userName, email, password: hashedPassword });
  
      const newDog = new Dog({
        name: dog.name,
        gender: dog.gender,
        breed: dog.breed,
        age: dog.age,
        size: dog.size,
        personality: dog.personality,
        owner: newUser._id
      });
  
      const savedDog = await newDog.save();
      newUser.dogs = [savedDog._id];
      await newUser.save();
  
      // Generar token y enviar cookie
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      });
  
      res.status(201).json({
        message: "Usuario y perro registrados correctamente",
        user: {
          _id: newUser._id,
          userName: newUser.userName,
          dogs: [savedDog]
        }
      });
      return;
    } catch (error) {
      console.error("Error en registerUser:", error);
      res.status(500).json({ message: "Error al registrar usuario y perro" });
      return;
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
export const checkAuth = (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401).json({ authenticated: false, error: 'Usuario no autenticado' });
    return;
  }

  res.status(200).json({ authenticated: true, user: authReq.user });
  return;
};

export const logoutUser = (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Sesión cerrada correctamente" });
    return 

    
};
