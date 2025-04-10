import { Request, Response } from 'express';
import { ParkVisitType } from '../interfaces/parkVisit.interface';
import ParkVisit from '../models/Park';
import { AuthenticatedRequest } from '../utils/types/types';


export const getDogsInPark = async (req: Request, res: Response) => {
  try {
    const parkId = req.params.id;
    const now = new Date();
    const visits: ParkVisitType[] = await ParkVisit.find({
      park: parkId,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } }
      ]
    })
      .populate('user', '-email -password')
      .populate('dogs');

    res.status(200).json({ parkId, dogsInPark: visits });
    return;
  } catch (error) {
    console.error(" Error en getDogsInPark:", error);
    res.status(500).json({ message: "Error al obtener perros en el parque" });
    return;
  }
};


export const checkInPark = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const { parkId, dogIds, duration } = authReq.body;
    const userId = authReq.user.id;

    if (!parkId || !dogIds || !dogIds.length) {
      res.status(400).json({ error: "Todos los campos son obligatorios." });
      return;
    }

    await ParkVisit.deleteMany({ user: userId });

    let expiresAt: Date | undefined;
    const now = new Date();

    switch (duration) {
      case '15min':
        expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
        break;
      case '30min':
        expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
        break;
      case '1h':
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      default:
        expiresAt = undefined;
    }

    const newVisit = new ParkVisit({
      park: parkId,
      user: userId,
      dogs: dogIds,
      checkedInAt: now,
      expiresAt
    });

    const savedVisit = await newVisit.save();

    res.status(201).json({ message: "Check-in realizado con éxito", visit: savedVisit });
    return;
  } catch (error) {
    console.error(" Error en checkInPark:", error);
    res.status(500).json({ message: "Error al hacer check-in en el pipicán" });
    return;
  }
};

export const checkOutPark = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const { parkId } = authReq.body;
    const userId = authReq.user.id;

    if (!parkId) {
      res.status(400).json({ error: "Se requiere parkId." });
      return;
    }

    const deletedVisit = await ParkVisit.findOneAndDelete({ park: parkId, user: userId });

    if (!deletedVisit) {
      res.status(404).json({ error: "No se encontró un registro para este usuario en este pipicán." });
      return;
    }

    res.status(200).json({ message: "Check-out realizado con éxito" });
    return;
  } catch (error) {
    console.error(" Error en checkOutPark:", error);
    res.status(500).json({ message: "Error al hacer check-out del pipicán" });
    return;
  }
};
