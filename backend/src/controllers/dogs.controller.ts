import { Request, Response } from 'express';
import Dog from '../models/Dog';
import User from '../models/User';

export const addDog = async (req: Request, res: Response) => {
    try {
        const { userId, name, breed, age, size, photo } = req.body;
        if (!userId || !name || !breed || !age || !size) {
            res.status(400).json({ error: "Todos los campos del perro son obligatorios." });
            return
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return 
        }
        const newDog = new Dog({
            name,
            breed,
            age,
            size,
            photo: photo || "https://via.placeholder.com/150",
            owner: userId
        });

        await newDog.save();

        user.dogs.push(newDog._id);
        await user.save();

        res.status(201).json({ message: "Perro agregado correctamente", dog: newDog });
        return 
    } catch (error) {
        console.error("Error en addDog:", error);
        res.status(500).json({ message: "Error al agregar perro" });
        return 
    }
};

export const getDogsByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('dogs');

        if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return 
        }

        res.status(200).json({ dogs: user.dogs });
        return 
    } catch (error) {
        console.error("Error en getDogsByUser:", error);
        res.status(500).json({ error: "Error al obtener los perros del usuario" });
        return 
    }
};


export const updateDog = async (req: Request, res: Response) => {
    try {
        const { dogId } = req.params;
        const updateFields = req.body;

        const updatedDog = await Dog.findByIdAndUpdate(dogId, updateFields, { new: true });

        if (!updatedDog) {
            res.status(404).json({ error: "Perro no encontrado" });
            return 
        }

        res.status(200).json({ message: "Perro actualizado correctamente", dog: updatedDog });
        return 
    } catch (error) {
        console.error("Error en updateDog:", error);
        res.status(500).json({ error: "Error al actualizar el perro" });
        return 
    }
};


export const deleteDog = async (req: Request, res: Response) => {
    try {
        const { dogId } = req.params;

        const deletedDog = await Dog.findByIdAndDelete(dogId);
        if (!deletedDog) {
            res.status(404).json({ error: "Perro no encontrado" });
            return 
        }
        res.status(200).json({ message: "Perro eliminado correctamente" });
        return
    } catch (error) {
        console.error("Error en deleteDog:", error);
        res.status(500).json({ error: "Error al eliminar el perro" });
        return
    }
};
