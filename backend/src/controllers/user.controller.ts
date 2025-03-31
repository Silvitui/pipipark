import { Request, Response } from 'express';
import User from '../models/User';
import Dog from '../models/Dog';
import { AuthenticatedRequest } from '../utils/types/types';

export const updateUser = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const userId = authReq.user._id;
    const { userName, email, dogId, dogData } = authReq.body;

    const existingUser = await User.findById(userId).populate("dogs");
    if (!existingUser) {
      res.status(404).json({ error: "El usuario no existe" });
      return;
    }

    if (userName) existingUser.userName = userName;

    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400).json({ error: "Este email ya está en uso" });
        return;
      }
      existingUser.email = email;
    }

    await existingUser.save();

    if (dogId && dogData) {
      const existingDog = await Dog.findOne({ _id: dogId, owner: userId });

      if (!existingDog) {
        res.status(404).json({ error: "El perro no existe o no pertenece al usuario." });
        return;
      }

      if (dogData.name) existingDog.name = dogData.name;
      if (dogData.breed) existingDog.breed = dogData.breed;
      if (dogData.birthday !== undefined) existingDog.birthday = dogData.age;
      if (dogData.size) existingDog.size = dogData.size;
      if (dogData.photo) existingDog.photo = dogData.photo;
      if (dogData.personality) existingDog.personality = dogData.personality;

      await existingDog.save();
    }

    res.status(200).json({
      message: "Usuario y/o perro actualizado correctamente",
      user: existingUser,
      dogs: existingUser.dogs,
    });
    return;
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ message: "Error al actualizar usuario y perro" });
    return;
  }
};

export const getProfile = (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401).json({ authenticated: false, error: 'Usuario no autenticado' });
    return;
  }

  res.status(200).json({
    user: {
      _id: authReq.user._id,
      userName: authReq.user.userName,
      dogs: authReq.user.dogs
    }
  });
  return;
};
