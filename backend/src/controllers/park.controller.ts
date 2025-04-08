import { Request, Response } from 'express';
import { ParkVisitType } from '../interfaces/parkVisit.interface';
import ParkVisit from '../models/Park';
import { AuthenticatedRequest } from '../utils/types/types';


export const getDogsInPark = async (req: Request, res: Response) => {
  try {
    const parkId = req.params.id;
    console.log("🧪 Buscando visitas en pipicán:", parkId);
    const visits: ParkVisitType[] = await ParkVisit.find({ park: parkId }) // ← dejamos el string
      .populate('user', '-email -password')
      .populate('dogs');
    
      res.status(200).json({ parkId, dogsInPark: visits });
    return 
  } catch (error) {
    console.error("❌ Error en getDogsInPark:", error);
    res.status(500).json({ message: "Error al obtener perros en el parque" });
    return 
  }
};


// export const checkInPark = async (req: Request, res: Response) => {
//   const authReq = req as AuthenticatedRequest;
//   try {
//     const { parkId, dogIds } = authReq.body;
//     const userId = authReq.user.id;

//     if (!parkId || !dogIds || !dogIds.length) {
//       res.status(400).json({ error: "Todos los campos son obligatorios." });
//       return;
//     }

//     const newVisit = new ParkVisit({
//       park: parkId,
//       user: userId,
//       dogs: dogIds
//     });

//     await newVisit.save();
//     console.log("✅ Check-in guardado:", newVisit);
//     res.status(201).json({ message: "Check-in realizado con éxito", visit: newVisit });
//     return;
//   } catch (error) {
//     console.error("Error en checkInPark:", error);
//     res.status(500).json({ message: "Error al hacer check-in en el pipicán" });
//     return;
//   }
// };

export const checkInPark = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { parkId, dogIds } = authReq.body;
    const userId = authReq.user.id;

    if (!parkId || !dogIds || !dogIds.length) {
      res.status(400).json({ error: "Todos los campos son obligatorios." });
      return 
    }

    // 🧹 Eliminar visitas anteriores de este usuario en cualquier pipicán
    await ParkVisit.deleteMany({ user: userId });

    // ✅ Crear nueva visita
    const newVisit = new ParkVisit({
      park: parkId,
      user: userId,
      dogs: dogIds
    });

    const savedVisit = await newVisit.save();

    console.log("✅ Check-in guardado:", savedVisit);

    res.status(201).json({ message: "Check-in realizado con éxito", visit: savedVisit });
    return 
  } catch (error) {
    console.error("❌ Error en checkInPark:", error);
    res.status(500).json({ message: "Error al hacer check-in en el pipicán" });
    return 
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
    console.error("Error en checkOutPark:", error);
    res.status(500).json({ message: "Error al hacer check-out del pipicán" });
    return;
  }
};
