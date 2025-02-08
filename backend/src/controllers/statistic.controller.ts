import { Request, Response } from 'express';
import ParkVisit from '../models/Park';

export const getHours = async (_req: Request, res: Response) => {
    try {
        const peakHours = await ParkVisit.aggregate([
            {
                $project: {
                    hour: { $hour: "entryTime" } // Extraer la hora de entrada del perro
                }
            },
            {
                $group: {
                    _id: "hour",
                    count: { $sum: 1 } // Contar cuantos registros hay por hora
                }
            },
            {
                $sort: { _id: 1 } // Ordenar por hora (de 0 a 23)
            }
        ]);
        
        res.status(200).json(peakHours);
        return 
    } catch (error) {
        console.error("Error en getPeakHours:", error);
        res.status(500).json({ message: "Error al obtener horas punta" });
        return 
    }
};
