import { Request, Response } from 'express';
import User from '../models/User';
import Dog from '../models/Dog';
import { AuthenticatedRequest } from '../utils/types/types';
import bcrypt from 'bcryptjs';


export const updateUser = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user.id;

    if (!userId) {
      res.status(401).json({ error: "Usuario no autenticado correctamente" });
      return;
    }
    const { userName, email, dogId, dogData } = req.body;

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
      if (dogData.birthday !== undefined) existingDog.birthday = dogData.birthday;
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
      email: authReq.user.email,
      dogs: authReq.user.dogs
    }
  });
  return;
};

export const changePassword = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user.id; 
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).json({ error: "Por favor, complete todos los campos." });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "Las nuevas contraseñas no coinciden." });
    return;
  }

  try {

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    // Comparar la contraseña actual enviada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "La contraseña actual es incorrecta." });
      return;
    }

    // Hashear la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña en el usuario y guardar
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente." });
    return;
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ error: "Error al cambiar la contraseña." });
    return;
  }
};