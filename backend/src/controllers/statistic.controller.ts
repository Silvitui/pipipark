import { Request, Response } from 'express';
import ParkVisit from '../models/Park';

export const getHours = async (_req: Request, res: Response) => {
  try {
    const peakHours = await ParkVisit.aggregate([
      {
        $project: {
          hour: { $hour: "$entryTime" } 
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json(peakHours);
    return;
  } catch (error) {
    console.error("Error en getHours:", error);
    res.status(500).json({ message: "Error al obtener horas punta" });
    return;
  }
};
