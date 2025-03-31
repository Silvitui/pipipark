import { Request, Response } from 'express';
import Dog from '../models/Dog';
import User from '../models/User';
import { AuthenticatedRequest } from '../utils/types/types';

export const addDog = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const { name, gender, breed, birthday, size, photo, personality, castrated } = authReq.body;
    const userId = authReq.user._id;

    if (!name || !gender || !breed || !birthday || !size || !personality || personality.length === 0) {
      res.status(400).json({ error: "Todos los campos del perro son obligatorios, incluyendo personalidad." });
      return;
    }

    if (typeof castrated !== 'boolean') {
      res.status(400).json({ error: "El campo 'castrado' debe ser verdadero o falso." });
      return;
    }

    const parsedBirthday = new Date(birthday);
    if (isNaN(parsedBirthday.getTime())) {
      res.status(400).json({ error: "La fecha de nacimiento no es válida." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const newDog = new Dog({
      name,
      gender,
      breed,
      birthday: parsedBirthday,
      size,
      photo: photo || "https://via.placeholder.com/150",
      personality,
      castrated,
      owner: userId
    });

    await newDog.save();

    user.dogs.push(newDog._id);
    await user.save();

    res.status(201).json({ message: "Perro agregado correctamente", dog: newDog });
    return;
  } catch (error) {
    console.error("Error en addDog:", error);
    res.status(500).json({ message: "Error al agregar perro" });
    return;
  }
};

export const getMyDogs = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const userId = authReq.user.id;

    const user = await User.findById(userId).populate('dogs');
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ dogs: user.dogs });
    return;
  } catch (error) {
    console.error("Error en getMyDogs:", error);
    res.status(500).json({ error: "Error al obtener los perros del usuario" });
    return;
  }
};

export const updateDog = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { id } = req.params; 
  const userId = authReq.user.id;
  const updateFields = req.body;

  try {
    const dog = await Dog.findById(id);
    if (!dog) {
     res.status(404).json({ error: "Perro no encontrado" });
     return
    }

    if (dog.owner.toString() !== userId) {
       res.status(403).json({ error: "No tienes permiso para editar este perro" });
       return
    }

    const updatedDog = await Dog.findByIdAndUpdate(id, updateFields, { new: true });
    res.status(200).json({ message: "Perro actualizado correctamente", dog: updatedDog });
  } catch (error) {
    console.error("Error en updateDog:", error);
    res.status(500).json({ error: "Error al actualizar el perro" });
  }
};

export const deleteDog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedDog = await Dog.findByIdAndDelete(id);
    if (!deletedDog) {
      res.status(404).json({ error: "Perro no encontrado" });
      return;
    }

    res.status(200).json({ message: "Perro eliminado correctamente" });
    return;
  } catch (error) {
    console.error("Error en deleteDog:", error);
    res.status(500).json({ error: "Error al eliminar el perro" });
    return;
  }
}
export const uploadDogPhoto = async (req: Request, res: Response) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) {
      res.status(404).json({ message: 'Perro no encontrado' });
      return;
    }

    if (!req.file) {
       res.status(400).json({ message: 'No se ha enviado ninguna imagen' });
       return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    dog.photo = `${baseUrl}/uploads/${req.file.filename}`;
    await dog.save();    

    res.json({ message: 'Foto actualizada correctamente', photo: dog.photo });
  } catch (error) {
    console.error('Error subiendo la foto del perro:', error);
    res.status(500).json({ message: 'Error subiendo la foto del perro' });
  }
};