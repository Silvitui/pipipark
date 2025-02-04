import { Request, Response } from 'express';
import { ParkVisitType } from '../interfaces/parkVisit.interface';
import ParkVisit from '../models/Park';


export const getDogsInPark = async (req: Request, res: Response) => {
    try {
        const { parkId } = req.params;
 const visits: ParkVisitType[] = await ParkVisit.find({ park: parkId })
            .populate('user', '-email -password') // trae solo el nombre del usuario, quitando el email y el password
            .populate('dogs'); //Trae toda la información de los perros

        if (!visits.length) {
            return res.status(200).json({ parkId, dogsInPark: [] });
        }

        return res.status(200).json({ parkId, dogsInPark: visits });
    } catch (error) {
        console.error("Error en getDogsInPark:", error);
        return res.status(500).json({ message: "Error al obtener perros en el parque" });
    }
};

export const checkInPark = async (req: Request, res: Response) => {
    try {
        const { parkId, userId, dogIds } = req.body;
        if (!parkId || !userId || !dogIds || !dogIds.length) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        const newVisit = new ParkVisit({
            park: parkId,
            user: userId,
            dogs: dogIds
        });

        await newVisit.save();

        return res.status(201).json({ message: "Check-in realizado con éxito", visit: newVisit });
    } catch (error) {
        console.error("Error en checkInPark:", error);
        return res.status(500).json({ message: "Error al hacer check-in en el pipicán" });
    }
};


export const checkOutPark = async (req: Request, res: Response) => {
    try {
        const { parkId, userId } = req.body;

        if (!parkId || !userId) {
            return res.status(400).json({ error: "Se requieren parkId y userId." });
        }

        const deletedVisit = await ParkVisit.findOneAndDelete({ park: parkId, user: userId });

        if (!deletedVisit) {
            return res.status(404).json({ error: "No se encontró un registro para este usuario en este pipicán." });
        }

        return res.status(200).json({ message: "Check-out realizado con éxito" });
    } catch (error) {
        console.error("Error en checkOutPark:", error);
        return res.status(500).json({ message: "Error al hacer check-out del pipicán" });
    }
};
